import { Pool } from "pg";

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

    const result = await this.pool.query(query, values);
    return this.mapToModel(result.rows[0]);
  }

  protected async findOne<K extends keyof T>(
    field: K,
    value: T[K]
  ): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${String(field)} = $1`;
    const result = await this.pool.query(query, [value]);
    return this.mapToModel(result.rows[0]) || null;
  }

  protected async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await this.pool.query(query);
    return this.mapToModel(result.rows[0]);
  }

  public async findById(id: IdType): Promise<T | null> {
    return this.findOne(this.id, id as T[keyof T]);
  }

  protected abstract mapToModel(row: any): T;
}
