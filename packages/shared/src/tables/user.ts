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

export interface AccountData {
  id: string;
  site?: string;
  comment?: string;
}

export const validateEmail = (email: string) => {
  return email && validator.isEmail(email);
};

export const validatePassword = (password: string) => {
  return password;
};

export const validateUserName = (userName: string) => {
  return userName && validator.isAlphanumeric;
};
