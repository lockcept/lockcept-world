export interface UserData {
  uuid: string;
  email: string;
  password: string;
  alias: string;
}

export interface UniqueAliasData {
  alias: string;
  uuid: string;
}

export interface AccountData {
  uuid: string;
  site?: string;
  comment?: string;
}
