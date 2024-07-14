import { Request, Response } from "express";
import { todoRepository } from "../repositories";
import { Todo } from "../models/todo";

export const getTodo = async (req: Request, res: Response) => {
  console.log(req.user, "get todo user");
  const todo = await todoRepository.findById(req.params.id);
  return res.status(200).send({ todo });
};

export const getTodos = async (_: Request, res: Response) => {
  console.log("get todos");

  const todos = await todoRepository.findAll();
  return res.status(200).send({ todos });
};

export const createTodo = async (req: Request, res: Response) => {
  console.log("Create Todo request!!");

  console.log("user", req.user);

  if (!req.user) return res.send({ error: "This user doesn't exist!" });

  const userId = req.user.id;

  const { todo } = req;
  if (!todo?.content || !todo.priority || !todo.id || !userId)
    return res.sendStatus(400);

  const newTodo: Todo = {
    id: todo.id,
    content: todo.content,
    priority: todo.priority,
    user_id: userId,
  };

  const result = await todoRepository.create(newTodo);
  return res.status(200).send({ result });
};

export const updateTodo = async (req: Request, res: Response) => {
  const { todo } = req;
  if (!todo) return res.send({ message: "There is no todo" }).status(400);

  if (!todo.content || !todo.priority || !todo.id)
    return res.send({ message: "Bad todo credentials" }).status(400);

  const updatedTodo = {
    content: todo.content,
    priority: todo.priority,
  };

  const result = await todoRepository.update(todo.id, updatedTodo);
  return res.status(200).send({ result });
};

export const deleteTodo = async (req: Request, res: Response) => {
  if (!req.todo?.id) return res.sendStatus(400);
  const result = await todoRepository.delete(req.todo?.id);
  return res.status(200).send({ result });
};
