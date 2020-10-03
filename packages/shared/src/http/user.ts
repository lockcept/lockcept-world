import { UserData } from "../tables/user";

export interface CreateUserRequest {
  userData: UserData;
}

export interface CreateUserResponse {
  ifCreated: boolean;
}

export interface CheckUserResponse {
  ifExist: boolean;
}
