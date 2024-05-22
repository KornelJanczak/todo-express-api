import { Request, Response } from "express";
import { createTodoQuery, updateTodoQuery, deleteTodoQuery } from "../db/todo";

export const createTodo = async (req: Request, res: Response) => {
  const { todo } = req;
  if (!todo?.content || !todo.priority) return res.sendStatus(400);
  const result = await createTodoQuery(todo.content, todo.priority);
  return res.status(200).send({ result });
};

export const updateTodo = async (req: Request, res: Response) => {
  const { todo } = req;
  if (!todo?.content || !todo.priority || !todo?.id) return res.sendStatus(400);
  const result = await updateTodoQuery(todo.id, todo.content, todo.priority);
  return res.status(200).send({ result });
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { todo } = req;
  if (!todo?.content || !todo.priority || !todo.id) return res.sendStatus(400);
  const result = await deleteTodoQuery(todo.id, todo.content, todo.priority);
  return res.status(200).send({ result });
};
