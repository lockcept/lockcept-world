import { UserData } from "../tables/user";

export interface SignupLocalRequest {
  userData: Omit<UserData, "id">;
}
