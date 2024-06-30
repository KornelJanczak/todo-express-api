import { Todo } from "./todo";

interface CoreUser {
  id: string;
  email?: string | undefined;
}

export interface User extends CoreUser {
  todos: Todo[];
}

export interface CreateUserDto extends CoreUser {}
