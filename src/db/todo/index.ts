import { Priority } from "../../models/todo";
import { todoQuery } from "./todoQuery";
import {
  createTodoText,
  updateTodoText,
  deleteTodoText,
  getTodoText,
  getTodosText,
} from "./todoQueriesText";

// Functions
export const getTodoQuery = async (id: string) =>
  await todoQuery({
    queryType: "get",
    queryText: getTodoText,
    id,
  });

export const getTodosQuery = async () =>
  await todoQuery({
    queryType: "getAll",
    queryText: getTodosText,
  });

export const createTodoQuery = async (content: string, priority: Priority) =>
  await todoQuery({
    queryType: "create",
    queryText: createTodoText,
    content,
    priority,
  });

export const updateTodoQuery = async (
  id: string,
  content?: string | null,
  priority?: Priority | null
) =>
  await todoQuery({
    queryType: "update",
    queryText: updateTodoText,
    id,
    content,
    priority,
  });

export const deleteTodoQuery = async (id: string) =>
  await todoQuery({
    queryType: "delete",
    queryText: deleteTodoText,
    id,
  });
