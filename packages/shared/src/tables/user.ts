import validator from "validator";

export interface UserData {
  id: string;
  email: string;
  password: string;
  userName: string;
}

export interface UniqueUserNameData {
  userName: string;
  id: string;
}

export const validateEmail = (email: string) => {
  return !!email && validator.isEmail(email) && email.length < 255;
};

export const validatePassword = (password: string) => {
  return !!password && password.length < 16;
};

export const validateUserName = (userName: string) => {
  return !!userName && validator.isAlphanumeric && userName.length < 16;
};
