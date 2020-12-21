import { ErrorNameType } from "@lockcept/shared";

export class CustomError extends Error {
  options: { name?: ErrorNameType; statusCode?: number } = {};

  constructor(
    message?: string,
    options?: { name?: ErrorNameType; statusCode?: number }
  ) {
    super(message);
    if (options?.name) this.options.name = options?.name;
    this.options.statusCode = options?.statusCode;
  }
}
