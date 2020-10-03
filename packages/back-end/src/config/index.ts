export const config = {
  app: { stage: process.env.STAGE || "dev" },
  table: {
    lockcept: process.env.LOCKCEPT_TABLE || "",
    user: process.env.USER_TABLE || "",
  },
};
