import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { Todo } from "../models/todo";
import { initialLog } from "../utils/helpers";

export const validationTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initialLog("Validation todo middleware executed");

  const validateResult = validationResult(req);

  if (!validateResult.isEmpty())
    return res.status(400).send({ msg: validateResult.array() });

  const data: Partial<Todo> = matchedData(req);

  console.log("DATA:", data);

  const result: Partial<Todo> = {
    id: req.params.id,
    content: data.content,
    priority: data.priority,
  };

  console.log("RESULT:", result);

  req.todo = result;
  next();
};
