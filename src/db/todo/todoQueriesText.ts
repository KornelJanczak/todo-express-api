//Queries for todo table
export const getTodosText = "SELECT * FROM todos";

export const getTodoText = "SELECT * FROM todos WHERE id = $1"

export const createTodoText = `INSERT INTO todos(content, priority) VALUES($1, $2) RETURNING *`;

export const updateTodoText = `
UPDATE todos 
   SET 
      content = $1,
      priority = $2 
   WHERE 
     id = $3
  `;

export const deleteTodoText = `DELETE FROM todos WHERE id = $1`;
