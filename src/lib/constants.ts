export const __DEV__ = process.env.NODE_ENV === "development";
export const __API_ENV__ = process.env.API_ENV || "development";

export const BASE_URL = __DEV__
  ? "http://localhost:3000"
  : "https://www.getguesstimate.com";
