import { createTodo } from "../controllers/todo";
import { Router } from "express";

export default (router: Router) => {
  router.post("/api/todo", createTodo);
};
