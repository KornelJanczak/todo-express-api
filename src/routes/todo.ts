import { createTodo, updateTodo } from "../controllers/todo";
import { Router } from "express";
import { checkSchema } from "express-validator";
import { todoSchema } from "../schemas/todo";
import { validationTodo } from "../middlewares/validationMiddleware";

export default (router: Router) => {
  router.post("/api/todo", checkSchema(todoSchema), validationTodo, createTodo);
  router.patch(
    "/api/todo/:id",
    checkSchema(todoSchema),
    validationTodo,
    updateTodo
  );
};
