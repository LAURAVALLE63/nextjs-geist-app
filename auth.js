import bcrypt from "bcryptjs";

const users = new Map(); // In-memory user store for MVP: email -> { passwordHash }

export async function registerUser(email, password) {
  if (users.has(email)) {
    throw new Error("Usuario ya registrado");
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  users.set(email, { passwordHash });
  return true;
}

export async function authenticateUser(email, password) {
  const user = users.get(email);
  if (!user) {
    return false;
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  return isMatch;
}
