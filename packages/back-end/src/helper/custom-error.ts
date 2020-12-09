export class CustomError extends Error {
  options: { statusCode?: number } = {};

  constructor(message?: string, options?: { statusCode?: number }) {
    super(message);
    this.options.statusCode = options?.statusCode;
  }
}
