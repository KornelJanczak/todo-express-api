import { User } from "../models/user";

export function isUser(user: any): user is User {
  return user && typeof user.id === "string" && typeof user.email === "string";
}