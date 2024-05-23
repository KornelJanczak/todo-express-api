import { db } from "..";
import { Priority } from "../../types/todo";

interface TodoQuery {
  id?: string;
  content?: string | null;
  priority?: Priority | null;
  queryText: string;
  queryType: "create" | "update" | "delete";
}

export const todoQuery = async ({
  id,
  content,
  priority,
  queryText,
  queryType,
}: TodoQuery) => {
  console.log(id, content, priority, queryText);

  try {
    let values: any[] = [content, priority];

    switch (queryType) {
      case "create":
        values = [content, priority];
        break;
      case "update":
        values = [content, priority, id];
        break;
      case "delete":
        values = [id];
        break;
      default:
        throw new Error("Invalid query type");
    }

    const result = await db.query(queryText, values);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error updating todo");
  }
};
