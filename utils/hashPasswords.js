import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = (password) => {
  return bcrypt.hash(password, saltRounds);
};

// Compares a plain text password against a hashed password
export const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
