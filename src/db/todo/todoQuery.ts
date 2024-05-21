import { db } from "..";
import { Priority } from "../../types/todo";

interface TodoQuery {
  id?: string;
  content: string;
  queryText: string;
  priority: Priority;
}

export const todoQuery = async ({
  id,
  content,
  priority,
  queryText,
}: TodoQuery) => {
  if (!content || !priority) return null;

  try {
    const values = [content, priority];
    const result = await db.query(queryText, values);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error updating todo");
  }
};
