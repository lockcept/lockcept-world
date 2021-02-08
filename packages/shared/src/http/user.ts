import { UserData } from "../tables";

export interface SignupLocalRequest {
  userData: Omit<UserData, "id">;
}

export interface SigninLocalRequest {
  email: string;
  password: string;
}

export interface SigninLocalResponse {
  token: string;
}

export interface UpdateEmailRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

export interface UpdateUserNameRequest {
  userName: string;
}

export interface UserDataResponse {
  userData: Omit<UserData, "password" | "id">;
}
