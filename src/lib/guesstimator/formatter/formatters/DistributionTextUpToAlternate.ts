import { Formatter } from "../types";
import { regexBasedFormatter, rangeRegex } from "./lib";

export const item: Formatter = {
  formatterName: "DISTRIBUTION_NORMAL_TEXT_UPTO",
  ...regexBasedFormatter(rangeRegex(/,\s?/, /\[/, /\]/)),
};
