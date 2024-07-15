import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodo,
} from "../controllers/todo";
import { Router } from "express";
import { checkSchema } from "express-validator";
import { createTodoSchema, updateTodoSchema } from "../schemas/todo";
import { validationTodo } from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export default (router: Router) => {
  router.use(authMiddleware);
  router.get("/api/todo", getTodos);
  router.get("/api/todo/:id", getTodo);
  router.post(
    "/api/todo",
    checkSchema(createTodoSchema),
    validationTodo,
    createTodo
  );
  router.delete("/api/todo/:id", deleteTodo);
  router.patch(
    "/api/todo/:id",
    checkSchema(updateTodoSchema),
    validationTodo,
    updateTodo
  );
};
