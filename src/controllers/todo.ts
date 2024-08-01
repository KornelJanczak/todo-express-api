import { NextFunction, Request, Response } from "express";
import { todoRepository } from "../repositories";
import { Todo } from "../models/todo";
import uuid4 from "uuid4";
import { initialLog } from "../utils/helpers";
import { AppError } from "../errors/appError";
export const getTodos = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initialLog("Get todos executed");
    const todos = await todoRepository.findAll();
    if (!todos) throw new AppError("No todos found!", 404);
    return res.status(200).send({ todos });
  } catch (err) {
    next(err);
  }
};

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

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initialLog(`Creating todo for user`);

  if (!req.user) throw new AppError("This user doesn't exist!", 401);
  const userId = req.user.id;

  if (!req.todo || !req.todo.content || !req.todo.priority || !userId)
    throw new AppError("Bad todo credentials", 400);
  const { content, priority } = req.todo;

  try {
    const newTodo: Todo = {
      id: `${uuid4()}`,
      content,
      priority,
      user_id: userId,
    };

    const result = await todoRepository.create(newTodo);
    if (!result) throw new AppError("Todo not created", 400);
    return res.status(200).send({ result });
  } catch (err) {
    next(err);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initialLog("Updating todo");
  const { todo } = req;

  console.log(todo);

  if (!todo) throw new AppError("Todo not found!", 404);
  if (!todo.id) throw new AppError("Todo id not found!", 400);
  if (!todo.content && !todo.priority)
    throw new AppError("Bad todo credentials", 400);

  try {
    const updatedTodo = {
      content: todo.content,
      priority: todo.priority,
    };

    const result = await todoRepository.update(todo.id, updatedTodo);
    if (!result) throw new AppError("Todo not found!", 404);
    return res.status(200).send({ result });
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initialLog("Delete todo");
  const todoID: string = req.params.id;
  if (!todoID) throw new AppError("Todo id not found!", 400);
  try {
    const result = await todoRepository.delete(todoID);
    if (!result) throw new AppError("Todo not found!", 404);
    return res.status(200).send({ deleted: result });
  } catch (err) {
    next(err);
  }
};
