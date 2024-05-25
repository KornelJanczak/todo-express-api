import { createTodo, updateTodo, deleteTodo } from "../controllers/todo";
import { Router } from "express";
import { checkSchema } from "express-validator";
import { createTodoSchema, updateTodoSchema } from "../schemas/todo";
import { validationTodo } from "../middlewares/validationMiddleware";
import { getTodo } from "../db/todo";

export default (router: Router) => {
  router.get("/api/todo", getTodo);
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
