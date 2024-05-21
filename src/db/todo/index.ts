import { Priority } from "../../types/todo";
import { todoQuery } from "./todoQuery";

// Query text
const createTodoText =
  "INSERT INTO todos(content, priority) VALUES($1, $2) RETURNING *";

const updateTodoText =
  "UPDATE todos SET content = $1, priority = $2 WHERE id = $3";

const deleteTodoText = (id: string) => `DELETE FROM todos WHERE id = $${id}`;

// Functions
export const createTodoQuery = async (content: string, priority: Priority) =>
  await todoQuery({ content, priority, queryText: createTodoText });

export const updateTodoQuery = async (content: string, priority: Priority) =>
  await todoQuery({ content, priority, queryText: updateTodoText });

export const deleteTodoQuery = async (
  content: string,
  priority: Priority,
  id: string
) => await todoQuery({ content, priority, queryText: deleteTodoText(id) });
