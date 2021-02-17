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
    GOOGLE_CLIENT_ID:
      "179614458237-l0eu34dv9s99im7p3nlk67a8c2cc6714.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "Zvn9Dk3PEngoHPhB7pYBHFTf",
  },
};
