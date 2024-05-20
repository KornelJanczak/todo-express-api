import { Request, Response } from "express";
import { insertTodo } from "../db/todo/insertTodo";
import { validationResult, matchedData } from "express-validator";
import { Todo } from "../types/todo";

export const createTodo = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) return res.status(400).send({ msg: result.array() });

  const data: Partial<Todo> = matchedData(req);

  if (!data.content || !data.priority)
    return res.status(400).send({ msg: "Content cannot be empty" });

  const todo = await insertTodo(data.content, data.priority);

  if (!todo) return res.sendStatus(400);

  return res.status(200).send({ msg: todo });
};
