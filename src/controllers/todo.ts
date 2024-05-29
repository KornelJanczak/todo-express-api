import { Request, Response } from "express";
import {
  createTodoQuery,
  updateTodoQuery,
  deleteTodoQuery,
  getTodosQuery,
  getTodoQuery,
} from "../db/todo";

export const getTodo = async (req: Request, res: Response) => {
  const todo = await getTodoQuery(req.params.id);
  return res.status(200).send({ todo });
};

export const getTodos = async (_: Request, res: Response) => {
  const todos = await getTodosQuery();
  return res.status(200).send({ todos });
};

export const createTodo = async (req: Request, res: Response) => {
  const { todo } = req;
  if (!todo?.content || !todo.priority) return res.sendStatus(400);
  const result = await createTodoQuery(todo.content, todo.priority);
  return res.status(200).send({ result });
};

export const updateTodo = async (req: Request, res: Response) => {
  const { todo } = req;
  if (!todo || (!todo.content && !todo.priority) || !todo?.id)
    return res.sendStatus(400);
  const result = await updateTodoQuery(todo.id, todo.content, todo.priority);
  return res.status(200).send({ result });
};

export const deleteTodo = async (req: Request, res: Response) => {
  const result = await deleteTodoQuery(req.params.id);
  return res.status(200).send({ result });
};
