import { db } from ".";
import { Priority } from "./../types/todo";
import { type ApiRoutes } from "./../types";

interface TodoQuery {
  id?: string;
  content?: string | null;
  priority?: Priority | null;
  queryText: string;
  queryType: ApiRoutes;
}

export const dbQuery = async ({
  id,
  content,
  priority,
  queryText,
  queryType,
}: TodoQuery) => {
  console.log(id, content, priority, queryText);

  let values: any[] | null = [content, priority];
  let result;

  console.log("db query");

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
      console.log("get db query");

      return await db.query(queryText, values);
    case "getAll":
      return await db.query(queryText);
    default:
      throw new Error("Invalid query type");
  }

  console.log("after switch");

  result = await db.query(queryText, values);

  console.log("result");

  return result;
};
