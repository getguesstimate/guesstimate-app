import * as errorTypes from "lib/propagation/errors";

import { or } from "gEngine/utils";

const {
  ERROR_TYPES: { PARSER_ERROR },
  ERROR_SUBTYPES: { PARSER_ERROR_SUBTYPES: INVALID_RANGE_ORDERING },
} = errorTypes;

const SUFFIXES = {
  "%": -2,
  K: 3,
  M: 6,
  B: 9,
  T: 12,
};

const spaceSep = (res) =>
  new RegExp(
    res
      .filter((re) => !!re)
      .map((re) => `(?:${re.source})`)
      .join("\\s*")
  );
const padded = (res) => spaceSep([/^/, ...res, /$/]);

const SUFFIX_REGEX = new RegExp(Object.keys(SUFFIXES).join("|"));
const INTEGER_REGEX = /(?:(?:\d+)|(?:\d{1,3}(?:,\d{3})*))(?!\.[^\.])/;
const DECIMAL_REGEX = /\d*\.\d+/;
const NUMBER_REGEX = new RegExp(
  `(-?${or([INTEGER_REGEX, DECIMAL_REGEX]).source})\\s?(${
    SUFFIX_REGEX.source
  })?`
);

export const POINT_REGEX = padded([NUMBER_REGEX]);
export const rangeRegex = (sep, left, right) =>
  padded([left, NUMBER_REGEX, sep, NUMBER_REGEX, right]);

const getMult = (suffix) => Math.pow(10, SUFFIXES[suffix]);
const parseNumber = (num, suffix) =>
  parseFloat(num.replace(",", "")) * (!!suffix ? getMult(suffix) : 1);

const rangeErrorFn = ([low, high]) =>
  low > high ? { type: PARSER_ERROR, subType: INVALID_RANGE_ORDERING } : {};

// We assume that if the user started at 0 or tried a negative number,
// they intended for this to be normal.
function getGuesstimateType(guesstimateType, [low]) {
  switch (guesstimateType) {
    case "UNIFORM":
      return guesstimateType;
    case "NORMAL":
      return guesstimateType;
    default:
      return low <= 0 ? "NORMAL" : "LOGNORMAL";
  }
}

export function regexBasedFormatter(
  re,
  guesstimateTypeFn = getGuesstimateType,
  errorFn = rangeErrorFn
) {
  return {
    matches({ text }) {
      return re.test(text);
    },
    error({ text }) {
      return errorFn(this._numbers(text));
    },

    format({ guesstimateType, text }) {
      const params = this._numbers(text);
      return {
        guesstimateType: guesstimateTypeFn(guesstimateType, params),
        params,
      };
    },

    _numbers(text) {
      return _.chunk(text.match(re).slice(1), 2).map(([num, suffix]) =>
        parseNumber(num, suffix)
      );
    },
  };
}
