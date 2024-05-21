export type Priority = "low" | "medium" | "high";

export type Todo = {
  id?: string;
  content: string;
  priority: Priority;
};
