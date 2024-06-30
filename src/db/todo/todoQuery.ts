import { db } from "..";
import { Priority } from "../../models/todo";
import { type ApiRoutes } from "../../models";

interface TodoQuery {
  id?: string;
  content?: string | null;
  priority?: Priority | null;
  queryText: string;
  queryType: ApiRoutes;
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
    let values: any[] | null = [content, priority];
    let result;

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
      case "get":
        values = [id];
        return await db.query(queryText, values);
      case "getAll":
        return await db.query(queryText);
      default:
        throw new Error("Invalid query type");
    }

    result = await db.query(queryText, values);

    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error updating todo");
  }
};
