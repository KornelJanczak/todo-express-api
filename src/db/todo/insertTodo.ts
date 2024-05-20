import { db } from "../index";
import { Priority } from "../../types/todo";

const createTodoText =
  "INSERT INTO todos(content, priority) VALUES($1, $2) RETURNING *";

export const insertTodo = async (content: string, priority: Priority) => {
  if (!content || !priority) return null;

  try {
    const values = [content, priority];
    const result = await db.query(createTodoText, values);
    console.log(result.rows[0], "Result rows");
    return result;
  } catch (err) {
    console.error(err, "SECOND CATCH");
  }
};
