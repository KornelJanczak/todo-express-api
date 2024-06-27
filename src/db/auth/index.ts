import { dbQuery } from "../dbQuery";
import {
  createUserText,
  getCurrentUserText,
  getUserByIdText,
} from "./authQueriesText";

export const getCurrentUserQuery = async (content?: string) =>
  await dbQuery({
    content,
    queryType: "get",
    queryText: getCurrentUserText,
  });

export const createUserQuery = async (google_id: string, content?: string) =>
  await dbQuery({
    google_id,
    content,
    queryType: "create",
    queryText: createUserText,
  });

export const getUserByIdQuery = async (google_id: string) =>
  await dbQuery({
    google_id,
    queryType: "get",
    queryText: getUserByIdText,
  });
