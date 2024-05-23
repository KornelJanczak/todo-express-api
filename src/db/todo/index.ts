import { Priority } from "../../types/todo";
import { todoQuery } from "./todoQuery";
import {
  createTodoText,
  updateTodoText,
  deleteTodoText,
} from "./todoQueriesText";

// Functions
export const createTodoQuery = async (
  content: string,
  priority: Priority
) =>
  await todoQuery({
    content,
    priority,
    queryText: createTodoText,
    queryType: "create",
  });

export const updateTodoQuery = async (
  id: string,
  content?: string | null,
  priority?: Priority | null
) =>
  await todoQuery({
    id,
    content,
    priority,
    queryText: updateTodoText,
    queryType: "update",
  });

export const deleteTodoQuery = async (id: string) =>
  await todoQuery({
    id,
    queryText: deleteTodoText,
    queryType: "delete",
  });
