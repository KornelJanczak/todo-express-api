import { CoreRepository } from "./coreRepository";
import { type Todo } from "../models/todo";
import { Pool } from "pg";

export class TodoRepository extends CoreRepository<Todo> {
  constructor(pool: Pool) {
    super(pool, "todos");
  }

  protected mapToModel(row: any): Todo | {} {
    if (!row) return {};

    return {
      id: row.id,
      content: row.content,
      priority: row.priority,
      user_id: row.user_id,
    };
  }
}
