import { Pool, QueryResult } from "pg";
import { getErrorMessage } from "../utils/helpers";
import { AppError } from "../errors/appError";

export abstract class CoreRepository<T, IdType = string> {
  constructor(
    protected pool: Pool,
    protected tableName: string,
    protected id: keyof T = "id" as keyof T
  ) {}

  public async create(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO ${this.tableName} (${fields.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;

    try {
      const result = await this.pool.query(query, values);
      return this.mapToModel(result.rows[0]);
    } catch (error) {
      throw new AppError("Error creating record", 500);
    }
  }

  public async update(id: IdType, data: Partial<T>): Promise<T> {
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

    try {
      const result = await this.pool.query(query, [...values, id]);

      if (result.rows.length === 0)
        throw new AppError(`No record found with id ${id}`, 404);

      return this.mapToModel(result.rows[0]);
    } catch (error) {
      throw new AppError("Error updating record", 500);
    }
  }

  public async delete(id: IdType): Promise<boolean> {
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

  public async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    try {
      const result = await this.pool.query(query);
      return result.rows.map((row) => this.mapToModel(row));
    } catch (error) {
      throw new AppError("Error fetching records", 500);
    }
  }

  public async findById(id: IdType): Promise<T | null> {
    return this.findOne(this.id, id as T[keyof T]);
  }

  protected async findOne<K extends keyof T>(
    field: K,
    value: T[K]
  ): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${String(field)} = $1`;

    try {
      const result = await this.pool.query(query, [value]);
      if (result.rows.length === 0) return null;
      return this.mapToModel(result.rows[0]);
    } catch (error) {
      throw new AppError("Error fetching record", 500);
    }
  }

  protected abstract mapToModel(row: any): T;
}
