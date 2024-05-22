import { db } from "..";
import { Priority } from "../../types/todo";

interface TodoQuery {
  content: string | null;
  queryText: string;
  priority: Priority | null;
}

export const todoQuery = async ({
  content,
  priority,
  queryText,
}: TodoQuery) => {
  console.log(content, priority, queryText); 
  
  try {
    const values = [content, priority];
    const result = await db.query(queryText, values);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error updating todo");
  }
};
