import { RootState } from "~/modules/store";
import _ from "lodash";
import * as _collections from "./collections";
import { HANDLE_REGEX } from "./facts";
import { FACT_ID_PREFIX, METRIC_ID_PREFIX } from "./simulation";
import * as _utils from "./utils";
import { Metric } from "~/modules/metrics/reducer";
import { Guesstimate } from "~/modules/guesstimates/reducer";

export function equals(l, r) {
  return (
    l.description === r.description &&
    l.guesstimateType === r.guesstimateType &&
    l.expression === r.expression
  );
}

export const getByMetricFn = (graph: Pick<RootState, "guesstimates">) =>
  _collections.getFn(_.get(graph, "guesstimates"), "metric");
export const uniq = (guesstimates: Guesstimate[]) =>
  _collections.uniq(guesstimates, "metric");

export const attributes = [
  "metric",
  "expression",
  "input",
  "guesstimateType",
  "description",
  "data",
];
export function format(guesstimate /*: Guesstimate */) /*: Guesstimate */ {
  const formatted = _.pick(guesstimate, attributes);
  return formatted;
}

export const extractFactHandles = ({ input }) =>
  _.isEmpty(input) ? [] : input.match(HANDLE_REGEX);
export const translateFactHandleFn = (idMap) => (g) => ({
  ...g,
  expression: _utils.replaceByMap(g.expression, idMap),
});

// TODO(matthew): No global regex constants...
const METRIC_ID_REGEX = new RegExp(`\\$\\{${METRIC_ID_PREFIX}([^\}]*)\\}`, "g");
export const extractMetricIds = ({ expression }) =>
  _.uniq(_utils.getSubMatches(expression, METRIC_ID_REGEX, 1));

// In the `expression` syntax, input metrics are expressed as `${metric:[metric id]}`. To match that in a regex, and
// translate to it, we need functions that wrap passed IDs in the right syntax, appropriately escaped.
export const expressionSyntaxPad = (id, isMetric = true) =>
  `\$\{${isMetric ? METRIC_ID_PREFIX : FACT_ID_PREFIX}${id}\}`;

// Returns a function which takes a guesstimate and returns that guesstimate with an input based on its
// expression.
export function expressionToInputFn(metrics: Metric[] = [], facts: any[] = []) {
  let idMap = {};

  metrics.forEach(({ id, readableId }) => {
    idMap[expressionSyntaxPad(id, true)] = readableId;
  });
  facts.forEach(({ id, variable_name }) => {
    idMap[expressionSyntaxPad(id, false)] = `#${variable_name}`;
  });

  const translateValidInputsFn = (expression: string) =>
    _utils.replaceByMap(expression, idMap);
  const translateRemainingInputsFn = (expression: string) =>
    expression.replace(/\$\{.*\}/, "??");

  const translateInputsFn = ({ expression }: Guesstimate) =>
    translateRemainingInputsFn(translateValidInputsFn(expression));

  return (g: Guesstimate) => ({
    ...g,
    // It's important that we don't translate expression to `input` when expression is empty,
    // because some old spaces store `input` instead of `expression`.
    ...(_.isEmpty(g.expression)
      ? { input: (g as any).input || "" }
      : { input: translateInputsFn(g) }),
  });
}

// Returns an expression based on the passed input and idMap.
export function inputToExpression(input, idMap) {
  const replaceMap = _.transform(idMap, (result: any, value, key) => {
    result[key] = expressionSyntaxPad(value.id, value.isMetric);
  });
  return _utils.replaceByMap(input, replaceMap);
}
