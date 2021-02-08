import { ErrorName as AccountErrorName } from "./account";
import { ErrorName as UserErrorName } from "./user";

export const ErrorName = { ...UserErrorName, ...AccountErrorName };

export type ErrorNameType = keyof typeof ErrorName;
