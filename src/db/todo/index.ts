import { Priority } from "../../types/todo";
import { todoQuery } from "./todoQuery";
import {
  createTodoText,
  updateTodoText,
  deleteTodoText,
  getTodoText,
} from "./todoQueriesText";

// Functions
export const getTodo = async () =>
  await todoQuery({
    queryType: "get",
    queryText: getTodoText,
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
