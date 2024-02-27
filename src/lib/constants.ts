export const __DEV__ =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

export const __API_ENV__ = process.env.NEXT_PUBLIC_VERCEL_ENV || "development";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000");
