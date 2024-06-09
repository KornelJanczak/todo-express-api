import { dbQuery } from "../dbQuery";
import {
  createUserText,
  getCurrentUserText,
  getUserByIdText,
} from "./authQueriesText";

export const getCurrentUserQuery = async () =>
  await dbQuery({
    queryType: "get",
    queryText: getCurrentUserText,
  });

export const createUserQuery = async () =>
  await dbQuery({
    queryType: "get",
    queryText: createUserText,
  });

export const getUserByIdQuerty = async () =>
  await dbQuery({
    queryType: "get",
    queryText: getUserByIdText,
  });
