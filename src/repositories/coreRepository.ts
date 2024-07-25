import { Pool, QueryResult } from "pg";
import { AppError } from "../errors/appError";

export abstract class CoreRepository<T, IdType = string> {
  constructor(
    protected pool: Pool,
    protected tableName: string,
    protected id: keyof T = "id" as keyof T
  ) {}

  public async Create(data: Partial<T>): Promise<T | null> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO ${this.tableName} (${fields.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;

    const result = await this.FetchRecord(query, values as T[keyof T]);
    if (!result || result.rows.length === 0) return null;

    return this.MapToModel(result.rows[0]);
  }

  public async Update(id: IdType, data: Partial<T>): Promise<T |  null>   {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setClause = fields
      .map((field, index) => `"${field}" = COALESCE($${index + 1}, "${field}")`)
      .join(", ");

    const query = `
      UPDATE ${this.tableName} 
      SET ${setClause} 
      WHERE ${String(this.id)} = $${fields.length + 1} 
      RETURNING *
    `;

    // try {
    //   const result = await this.pool.query(query, [...values, id]);

    //   if (result.rows.length === 0)
    //     throw new AppError(`No record found with id ${id}`, 404);

    //   return this.MapToModel(result.rows[0]);
    // } catch (error) {
    //   throw new AppError("Error updating record", 500);
    // }

    const result = await this.FetchRecord(query, values as T[keyof T]);
    if (!result || result.rows.length === 0) return null;

    return this.MapToModel(result.rows[0]);
  }

  public async Delete(id: IdType): Promise<boolean> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE ${String(this.id)} = $1
      RETURNING *
    `;

    try {
      const result: QueryResult = await this.pool.query(query, [id]);

      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      throw new AppError("Error deleting record", 500);
    }
  }

  public async FindAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    try {
      const result = await this.pool.query(query);
      return result.rows.map((row) => this.MapToModel(row));
    } catch (error) {
      throw new AppError("Error fetching records", 500);
    }
  }

  public async FindById(id: IdType): Promise<T | null> {
    return this.FindOne(this.id, id as T[keyof T]);
  }

  protected async FindOne<K extends keyof T>(
    field: K,
    value: T[K]
  ): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${String(field)} = $1`;

    this.PoolGuard();

    const result = await this.FetchRecord(query, value);
    if (!result || result.rows.length === 0) return null;

    return this.MapToModel(result.rows[0]);
  }

  protected abstract MapToModel(row: any): T;

  private async FetchRecord<K extends keyof T>(
    query: string,
    value: T[K]
  ): Promise<QueryResult<any> | undefined> {
    let result;
    try {
      result = await this.pool.query(query, [value]);
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error(`Error occurred: ${error.message}`);
        throw new AppError("Error fetching record", 500, error.stack);
      }
    }
    return result;
  }

  private PoolGuard(stack?: string): void {
    if (!this.pool) throw new AppError("Database connection error", 500, stack);
  }

  private QueryGuard(result: QueryResult<any>): boolean {
    return !result || result.rows.length === 0;
  }
}
