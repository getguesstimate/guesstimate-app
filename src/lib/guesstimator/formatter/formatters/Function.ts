import _ from "lodash";
import * as errorTypes from "lib/propagation/errors";
import { Formatter } from "../types";

const {
  ERROR_TYPES: { PARSER_ERROR },
  ERROR_SUBTYPES: {
    PARSER_ERROR_SUBTYPES: { MISSING_FUNCTION_BODY },
  },
} = errorTypes;

export const item: Formatter = {
  formatterName: "FUNCTION",
  matches({ text }) {
    return !!text && text.startsWith("=");
  },
  error({ text }) {
    return !_.isEmpty((text as any).slice(1))
      ? {}
      : { type: PARSER_ERROR, subType: MISSING_FUNCTION_BODY };
  },
  format({ text }) {
    return { guesstimateType: "FUNCTION", text: (text as any).slice(1) };
  },
};
