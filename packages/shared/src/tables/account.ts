import { isNil } from "lodash";

export interface AccountData {
  userId: string;
  site?: string;
  comment?: string;
}

export const validateAccountData = (data: Partial<AccountData>) => {
  const { site, comment } = data;
  if (!isNil(site)) {
    const check: boolean = !!site && site.length < 256;
    if (!check) {
      return false;
    }
  }
  if (!isNil(comment)) {
    const check: boolean = !!comment && comment.length < 512;
    if (!check) {
      return false;
    }
  }
  return true;
};
