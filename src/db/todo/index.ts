import { Priority } from "../../types/todo";
import { todoQuery } from "./todoQuery";

// Query text
const createTodoText =
  "INSERT INTO todos(content, priority) VALUES($1, $2) RETURNING *";

const updateTodoText = (id: string) =>
  `UPDATE todos SET content = COALESCE($1, content), priority = COALESCE($2, priority) WHERE id = $${id}`;

const deleteTodoText = (id: string) => `DELETE FROM todos WHERE id = $${id}`;

// Functions
export const createTodoQuery = async (content: string, priority: Priority) => {
  await todoQuery({ content, priority, queryText: createTodoText });
};

export const updateTodoQuery = async (
  id: string,
  content: string | null,
  priority: Priority | null
) => {
  let query = "UPDATE todos SET ";
  let values = [];
  let index = 1;

  if (content !== null) {
    query += `content = $${index}, `;
    values.push(content);
    index++;
  }

  if (priority !== null) {
    query += `priority = $${index}, `;
    values.push(priority);
    index++;
  }

  // Remove the last comma and space
  query = query.slice(0, -2);

  query += ` WHERE id = $${index}`;
  values.push(id);
  await todoQuery({ content, priority, queryText: query});
};

export const deleteTodoQuery = async (
  id: string,
  content: string,
  priority: Priority
) => {
  await todoQuery({ content, priority, queryText: deleteTodoText(id) });
};
