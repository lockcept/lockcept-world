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
