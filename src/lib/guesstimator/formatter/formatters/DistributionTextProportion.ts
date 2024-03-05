import { Formatter } from "../types";
import { regexBasedFormatter, rangeRegex } from "./lib";

export const item: Formatter = {
  formatterName: "DISTRIBUTION_PROPORTIONALITY",
  ...regexBasedFormatter(rangeRegex(/of|in/), () => "BETA"),
};
