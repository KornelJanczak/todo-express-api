import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { Todo } from "../models/todo";

export const validationTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = validationResult(req);

  if (!validateResult.isEmpty())
    return res.status(400).send({ msg: validateResult.array() });

  const data: Partial<Todo> = matchedData(req);

  const result: Partial<Todo> = {
    id: req.params.id,
    content: data.content,
    priority: data.priority,
  };

  req.todo = result;
  next();
};
