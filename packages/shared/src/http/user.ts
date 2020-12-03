import { UserData } from "../tables";

export interface SignupLocalRequest {
  userData: Omit<UserData, "id">;
}
