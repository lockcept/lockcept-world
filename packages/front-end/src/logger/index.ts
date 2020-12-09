export const errorLogger = (e: Error | string, data?: Record<string, any>) => {
  // eslint-disable-next-line no-console
  if (data) console.log(e, data);
  // eslint-disable-next-line no-console
  else console.log(e);
};
