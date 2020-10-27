export const config = {
  app: { stage: process.env.STAGE || "dev" },
  table: {
    lockcept: process.env.LOCKCEPT_TABLE || "",
    user: process.env.USER_TABLE || "",
    uniqueEmail: process.env.UNIQUE_EMAIL_TABLE || "",
    uniqueAlias: process.env.UNIQUE_ALIAS_TABLE || "",
    account: process.env.ACCOUNT_TABLE || "",
  },
};
