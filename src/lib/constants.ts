export const DEBUG = process.env.NEXT_PUBLIC_LOG_LEVEL === "debug";

// `?? ""` is to guarantee that value is a string, for correct types
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
