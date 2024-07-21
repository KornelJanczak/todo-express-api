import { Pool } from "pg";
import { CreateUserDto, User } from "../models/user";
import { CoreRepository } from "./coreRepository";

export class UserRepository extends CoreRepository<User> {
  constructor(pool: Pool) {
    super(pool, "users");
  }

  //
  public async createUser({ id, email }: CreateUserDto): Promise<User | {}> {
    const query = "INSERT INTO users (id, email) VALUES ($1, $2)";
    const result = await this.pool.query(query, [id, email]);
    return this.mapToModel(result.rows[0]);
  }

  //
  public async findByEmail(email?: string | undefined): Promise<User | null> {
    return this.findOne("email", email);
  }

  //
  public async findById(id: string): Promise<User | null> {
    return this.findOne("id", id);
  }

  //
  protected mapToModel(row: any): User {
    return {
      id: row.id,
      email: row.email,
      todos: row.todo,
    };
  }
}
