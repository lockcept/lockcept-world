export interface UserData {
  uuid: string;
  email: string;
  password: string;
  userName: string;
}

export interface UniqueUserNameData {
  userName: string;
  uuid: string;
}

export interface AccountData {
  uuid: string;
  site?: string;
  comment?: string;
}
