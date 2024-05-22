import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { Todo } from "../types/todo";

export const validationTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = validationResult(req);

  if (!validateResult.isEmpty())
    return res.status(400).send({ msg: validateResult.array() });

  const data: Partial<Todo> = matchedData(req);

  if (!data.content || !data.priority)
    return res.status(400).send({ msg: "Content cannot be empty" });

  const result: Partial<Todo> = {
    id: req.params.id,
    content: data.content,
    priority: data.priority,
  };

  req.todo = result;
  next();
};
