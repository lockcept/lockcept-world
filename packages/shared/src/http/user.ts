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
