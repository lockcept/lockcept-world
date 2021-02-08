import bcrypt from "bcryptjs";

const hash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const compareHash = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export { hash, compareHash };
