import { item as Funct } from "./formatters/Function";
import { item as DistributionTextUpTo } from "./formatters/DistributionTextUpTo";
import { item as DistributionTextUpToAlternate } from "./formatters/DistributionTextUpToAlternate";
import { item as DistributionTextProportion } from "./formatters/DistributionTextProportion";
import { item as DistributionPointText } from "./formatters/DistributionPointText";
import { item as Data } from "./formatters/Data";
import { item as Null } from "./formatters/Null";

export const formatters = [
  Funct,
  DistributionTextUpTo,
  DistributionTextProportion,
  DistributionTextUpToAlternate,
  DistributionPointText,
  Data,
];

export function _matchingFormatter(g) {
  for (let formatter of formatters) {
    if (formatter.matches(g)) {
      return formatter;
    }
  }
  return Null;
}

// General formatting that applies to everything.  After it goes through
// this stage, a specific formatter gets applied.
export function prepare(guesstimate) {
  return {
    text: guesstimate.input || guesstimate.text,
    guesstimateType: guesstimate.guesstimateType,
    data: guesstimate.data || guesstimate.value,
  };
}

export function parse(g) {
  const i = prepare(g);
  const formatter = _matchingFormatter(i);
  return [formatter.error(i), formatter.format(i)];
}
