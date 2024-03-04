import { __API_ENV__ } from "~/lib/constants";

export const rootUrl =
  __API_ENV__ === "development"
    ? "http://localhost:4000"
    : "https://api.guesstimate.com";
