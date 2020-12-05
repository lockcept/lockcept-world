import { isNil } from "lodash";
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
  return !isNil(email) && validator.isEmail(email) && email.length < 255;
};

export const validatePassword = (password: string) => {
  return !isNil(password) && password.length < 16;
};

export const validateUserName = (userName: string) => {
  return !isNil(userName) && validator.isAlphanumeric && userName.length < 16;
};
