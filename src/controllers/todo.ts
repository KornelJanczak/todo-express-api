import { NextFunction, Request, Response } from "express";
import { todoRepository } from "../repositories";
import { Todo } from "../models/todo";
import uuid4 from "uuid4";
import { initialLog } from "../utils/helpers";
import { AppError } from "../errors/appError";

export const getTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initialLog("Get Todo executed");
    const todo = await todoRepository.findById(req.params.id);
    if (!todo) throw new AppError("Todo not found!", 404);
    return res.status(200).send({ todo });
  } catch (err) {
    next(err);
  }
};

export const getTodos = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  initialLog("Get todos executed");
  const todos = await todoRepository.findAll();
  return res.status(200).send({ todos });
};

export const createTodo = async (req: Request, res: Response) => {
  initialLog("Create todo!!!");

  if (!req.user) return res.send({ error: "This user doesn't exist!" });

  const userId = req.user.id;
  const { todo } = req;

  if (!todo?.content || !todo.priority || !userId)
    return res.status(400).send({ error: "Bad todo credentials!" });

  const newTodo: Todo = {
    id: `${uuid4()}`,
    content: todo.content,
    priority: todo.priority,
    user_id: userId,
  };

  const result = await todoRepository.create(newTodo);
  return res.status(200).send({ result });
};

export const updateTodo = async (req: Request, res: Response) => {
  initialLog("Update todo!!!");
  const { todo } = req;

  if (!todo) return res.send({ message: "There is no todo" }).status(400);

  if (!todo.id) return res.send({ message: "Todo id is required" }).status(400);

  if (!todo.content && !todo.priority)
    return res.send({ message: "Bad todo credentials" }).status(400);

  const updatedTodo = {
    content: todo.content,
    priority: todo.priority,
  };

  const result = await todoRepository.update(todo.id, updatedTodo);
  return res.status(200).send({ result });
};

export const deleteTodo = async (req: Request, res: Response) => {
  initialLog("Delete todo!!!");
  const todoID: string = req.params.id;
  if (!todoID) return res.sendStatus(400);
  const result = await todoRepository.delete(todoID);
  return res.status(200).send({ deleted: result });
};
