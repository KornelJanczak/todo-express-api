import { db } from ".";
import { Priority } from "./../types/todo";
import { type ApiRoutes } from "./../types";

interface TodoQuery {
  google_id?: string;
  content?: string;
  priority?: Priority | null;
  queryText: string;
  queryType: ApiRoutes;
}

export const dbQuery = async ({
  google_id,
  content,
  queryText,
  queryType,
}: TodoQuery) => {
  console.log(google_id, content, queryText);

  let values: any[] | null = [content];
  let result;

  console.log("db query");

  switch (queryType) {
    case "create":
      values = [google_id, content];
      break;
    case "update":
      values = [content, google_id];
      break;
    case "delete":
      values = [google_id];
      break;
    case "get":
      values = [google_id || content];

      const result = await db.query(queryText, values);

      console.log(result, "Result");

      return result;
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
