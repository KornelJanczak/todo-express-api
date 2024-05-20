export const todoSchema = {
  content: {
    errorMessage: "Content cannot be empty",
    isString: {
      errorMessage: "Content must be a string",
    },
  },
  priority: {
    errorMessage: "Priority cannot be empty",
    isIn: {
      options: [["low", "medium", "high"]],
      errorMessage: "Priority must be low, medium, or high",
    },
  },
};
