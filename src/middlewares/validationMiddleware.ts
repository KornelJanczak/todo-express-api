import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { Todo } from "../types/todo";

export const validationTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);

  if (!result.isEmpty()) return res.status(400).send({ msg: result.array() });

  const data: Partial<Todo> = matchedData(req);

  if (!data.content || !data.priority)
    return res.status(400).send({ msg: "Content cannot be empty" });

  req.todo = data;
  next();
};
