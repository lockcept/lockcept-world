import { isNil, isUndefined } from "lodash";

export interface AccountData {
  userId: string;
  site?: string;
  comment?: string;
}

export const validateAccountData = (data: Partial<AccountData>) => {
  const { site, comment } = data;
  if (!isUndefined(site)) {
    const check: boolean = !isNil(site) && site.length < 256;
    if (!check) {
      return false;
    }
  }
  if (!isUndefined(comment)) {
    const check: boolean = !isNil(comment) && comment.length < 512;
    if (!check) {
      return false;
    }
  }
  return true;
};
