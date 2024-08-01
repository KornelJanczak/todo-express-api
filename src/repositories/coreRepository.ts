import { Pool, QueryResult } from "pg";
import { AppError } from "../errors/appError";

export abstract class CoreRepository<T, IdType = string> {
  constructor(
    protected pool: Pool,
    protected tableName: string,
    protected id: keyof T = "id" as keyof T
  ) {}

  public async create(data: Partial<T>): Promise<T | null> {
    const uniqueField = "email" as keyof T;
    const uniqueValue = data[uniqueField];

    if (uniqueValue) {
      const existingRecord = await this.findByUniqueField(
        uniqueField,
        uniqueValue
      );
      if (existingRecord) {
        throw new AppError("Record with this unique field already exists", 400);
      }
    }

    const { query, values } = this.buildInsertQuery(data);
    console.log("Insert query:", query, "Values:", values);
    const result = await this.executeQuery(query, values);
    console.log("Query result:", result);
    const processedResult = this.processResult(result);
    console.log("Processed result:", processedResult);
    return processedResult;
  }

  public async update(id: IdType, data: Partial<T>): Promise<T | null> {
    const { query, values } = this.buildUpdateQuery(id, data);
    const result = await this.executeQuery(query, values);
    return this.processResult(result);
  }

  public async delete(id: IdType): Promise<boolean | null> {
    const query = `DELETE FROM ${this.tableName} WHERE ${String(
      this.id
    )} = $1 RETURNING *`;
    const result = await this.executeQuery(query, [id]);
    return this.processResult(result) ? true : false;
  }

  public async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await this.executeQuery(query);
    return result ? result.rows.map(this.mapToModel) : null;
  }

  public async findById(id: IdType): Promise<T | null> {
    return this.findOne(this.id, id as T[keyof T]);
  }

  private async findByUniqueField<K extends keyof T>(
    field: K,
    value: T[K]
  ): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${String(field)} = $1`;
    const result = await this.executeQuery(query, [value]);
    return this.processResult(result);
  }

  protected abstract mapToModel(row: any): T;
  protected async findOne<K extends keyof T>(
    field: K,
    value: T[K]
  ): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${String(field)} = $1`;

    const result = await this.executeQuery(query, [value]);

    return this.processResult(result);
  }

  private buildInsertQuery(data: Partial<T>): { query: string; values: any[] } {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");
    const query = `INSERT INTO ${this.tableName} (${fields.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;
    return { query, values };
  }

  private buildUpdateQuery(
    id: IdType,
    data: Partial<T>
  ): { query: string; values: any[] } {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setClause = fields
      .map((field, index) => `"${field}" = COALESCE($${index + 1}, "${field}")`)
      .join(", ");

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE ${String(
      this.id
    )} = $${fields.length + 1} RETURNING *`;

    values.push(id);

    return { query, values };
  }

  private async executeQuery<K extends keyof T>(
    query: string,
    values?: (T[K] | IdType)[]
  ): Promise<QueryResult<any> | undefined> {
    this.poolGuard();
    try {
      return await this.pool.query(query, values);
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error(`${error.message}`);
        throw new AppError("Error querying database", 500, error.stack);
      }
    }
  }

  private processResult(result: QueryResult<any> | undefined): T | null {
    if (
      !result ||
      !result.rowCount ||
      result.rows.length === 0 ||
      result.rowCount < 0
    )
      return null;
    return this.mapToModel(result.rows[0]);
  }
  private poolGuard(stack?: string): void {
    if (!this.pool) throw new AppError("Database connection error", 500, stack);
  }
}
