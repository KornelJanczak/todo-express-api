export const getCurrentUserText = "SELECT * FROM users WHERE google_id=$1";

export const createUserText =
  "INSERT INTO users (username, img, google_id) VALUES ($1,$2,$3)";

export const getUserByIdText = "SELECT id FROM users WHERE google_id=$1";
