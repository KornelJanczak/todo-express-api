import { User } from "../models/user";

export function isUser(user: any): user is User {
  return user && typeof user.id === "string" && typeof user.email === "string";
}

export function initialLog(content: string) {
  console.log("------------------------");
  console.log(content);
  console.log("------------------------");
}

export const getErrorMessage = (error: unknown) => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    throw new Error("Something went wrong!");
  }

  throw new Error(message);
};
