import { Request, Response } from "express";
import { insertTodo } from "../db/todo";

export const createTodo = async (req: Request, res: Response) => {
  console.log(req.body);

  const todo = await insertTodo(req.body.content, req.body.priority);

  if (!todo) res.sendStatus(400);

  
  return res.status(200).send({ msg: todo });
};
