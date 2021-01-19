import { AccountData } from "../tables";

export interface CreateAccountRequest {
  accountData: AccountData;
}

export interface AccountDataResponse {
  accountData: AccountData;
}
