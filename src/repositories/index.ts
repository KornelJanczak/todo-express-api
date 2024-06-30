import { db } from "../db";
import { UserRepository } from "./userRepository";
import { TodoRepository } from "./todoRepository";

export const userRepository = new UserRepository(db);
export const todoRepository = new TodoRepository(db);
