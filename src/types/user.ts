import { Todo } from "./todo";

export interface User {
  id: string;
  email: string;
  todos: Todo[];
}
