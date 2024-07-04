import { Pool, QueryResult } from "pg";

export abstract class CoreRepository<T, IdType = string> {
  constructor(
    protected pool: Pool,
    protected tableName: string,
    protected id: keyof T = "id" as keyof T
  ) {}

  public async create(data: Partial<T>): Promise<T | {}> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO ${this.tableName} (${fields.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;

    const result = await this.pool.query(query, values);
    return this.mapToModel(result.rows[0]);
  }

  public async update(id: IdType, data: Partial<T>): Promise<T | {}> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const query = `
      UPDATE ${this.tableName} 
      SET ${setClause} 
      WHERE ${String(this.id)} = $${fields.length + 1} 
      RETURNING *
    `;

    const result = await this.pool.query(query, [...values, id]);

    return this.mapToModel(result.rows[0]);
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
      console.error("Error deleting record:", error);
      return false;
    }
  }

  public async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await this.pool.query(query);
    const mappedData: (T | {})[] = result.rows.map((row) =>
      this.mapToModel(row)
    );
    return mappedData;
  }

  public async findById(id: IdType): Promise<T | {}> {
    return this.findOne(this.id, id as T[keyof T]);
  }

  protected async findOne<K extends keyof T>(
    field: K,
    value: T[K]
  ): Promise<T | {}> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${String(field)} = $1`;

    console.log(this.tableName, "table name");

    const result = await this.pool.query(query, [value]);
    return this.mapToModel(result.rows[0]);
  }

  protected abstract mapToModel(row: any): T | {};
}
