import { ErrorName as UserErrorName } from "./user";

export const ErrorName = { ...UserErrorName };

export type ErrorNameType = keyof typeof ErrorName;
