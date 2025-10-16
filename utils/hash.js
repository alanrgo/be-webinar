import { hashSync, genSaltSync, compareSync } from "bcryptjs";

export function hashPassword(password) {
  const salt = genSaltSync(10);

  const hash = hashSync(password, salt);

  return hash;
}

export function validatePassword(password, hashedPassword) {
  return compareSync(password, hashedPassword);
}
