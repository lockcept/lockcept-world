import { UserData } from "../tables/user";

export interface CreateUserRequest {
  userData: Omit<UserData, "id">;
}

export interface CreateUserResponse {
  ifCreated: boolean;
}

export interface CheckUserResponse {
  ifExist: boolean;
}
