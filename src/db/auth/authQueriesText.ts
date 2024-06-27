export const getCurrentUserText = "SELECT * FROM users WHERE email=$1";

export const createUserText =
  "INSERT INTO users (id, email) VALUES ($1, $2)";

export const getUserByIdText = "SELECT * FROM users WHERE id=$1";
