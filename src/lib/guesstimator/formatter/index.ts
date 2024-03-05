import { PropagationError } from "~/lib/propagation/errors";

import { item as Data } from "./formatters/Data";
import { item as DistributionPointText } from "./formatters/DistributionPointText";
import { item as DistributionTextProportion } from "./formatters/DistributionTextProportion";
import { item as DistributionTextUpTo } from "./formatters/DistributionTextUpTo";
import { item as DistributionTextUpToAlternate } from "./formatters/DistributionTextUpToAlternate";
import { item as Funct } from "./formatters/Function";
import { item as Null } from "./formatters/Null";
import { Formatter, FormatterInput } from "./types";

export const formatters: Formatter[] = [
  Funct,
  DistributionTextUpTo,
  DistributionTextProportion,
  DistributionTextUpToAlternate,
  DistributionPointText,
  Data,
];

export function _matchingFormatter(g: FormatterInput): Formatter {
  for (const formatter of formatters) {
    if (formatter.matches(g)) {
      return formatter;
    }
  }
  return Null;
}

// General formatting that applies to everything.  After it goes through
// this stage, a specific formatter gets applied.
export function prepare(guesstimate): FormatterInput {
  return {
    text: guesstimate.input || guesstimate.text,
    guesstimateType: guesstimate.guesstimateType,
    data: guesstimate.data || guesstimate.value,
  };
}

export function parse(g): [PropagationError | undefined, any] {
  const i = prepare(g);
  const formatter = _matchingFormatter(i);
  return [formatter.error(i), formatter.format(i)];
}
