import { db } from ".";
import { Priority } from "../types/todo";

export const insertTodo = async (content: string, priority: Priority) => {
  try {
    const text =
      "INSERT INTO todo-express-app(content, priority) VALUES($1, $2) RETURNING *";
    const values = [content, priority];
    const result = await db.query(text, values);
    console.log(result.rows[0]);
    return result;
  } catch (err) {
    console.error(err);
  }
};
