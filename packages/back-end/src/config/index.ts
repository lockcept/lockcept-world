export const config = {
  app: { stage: process.env.STAGE || "dev" },
  table: {
    lockcept: process.env.LOCKCEPT_TABLE || "",
    user: process.env.USER_TABLE || "",
    uniqueEmail: process.env.UNIQUE_EMAIL_TABLE || "",
    uniqueUserName: process.env.UNIQUE_USER_NAME_TABLE || "",
    account: process.env.ACCOUNT_TABLE || "",
  },
  key: {
    JWT_USER: "BPvwjfOhgllockcept",
  },
};
