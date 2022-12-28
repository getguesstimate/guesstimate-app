import { Formatter } from "../types";
import { regexBasedFormatter, POINT_REGEX } from "./lib";

export const item: Formatter = {
  formatterName: "DISTRIBUTION_POINT_TEXT",
  ...regexBasedFormatter(
    POINT_REGEX,
    () => "POINT",
    () => {}
  ),
};
