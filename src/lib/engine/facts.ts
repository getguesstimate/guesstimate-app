import _ from "lodash";

import * as _collections from "./collections";
import * as _guesstimate from "./guesstimate";
import { generateRandomReadableId } from "./metric/generate_random_readable_id";
import * as _organization from "./organization";
import { NUM_SAMPLES } from "./simulation";
import * as _utils from "./utils";

import { sortDescending } from "~/lib/dataAnalysis";
import { _matchingFormatter } from "~/lib/guesstimator/formatter/index";
import { Guesstimator } from "~/lib/guesstimator/index";
import { PropagationError } from "../propagation/errors";
import { Guesstimate } from "~/modules/guesstimates/reducer";

export type Fact = {
  id: number;
  category_id?: string | null;
  name: string;
  variable_name: string;
  expression: string;
  exported_from_id?: number | null;
  metric_id?: string | null;
  // FIXME - should use `Simulation` type
  simulation: {
    sample: {
      values: number[];
      errors: PropagationError[];
    };
    stats: {
      adjustedConfidenceInterval?: [number, number];
      mean?: number;
      stdev?: number;
      length?: number;
      percentiles?: {
        5: number;
        50: number;
        95: number;
      };
    };
  };
};

export const GLOBALS_ONLY_REGEX = /@\w+(?:\.\w+)?/g;
export const HANDLE_REGEX = /(?:@\w+(?:\.\w+)?|#\w+)/g;

export const getVar = (f: Fact) => _utils.orStr(f.variable_name);
export const byVariableName = (name: string) => (f: Fact) => getVar(f) === name;
const namedLike = (partial) => (f) => getVar(f).startsWith(partial);

export const isExportedFromSpace = (f: Fact) =>
  _utils.allPropsPresent(f, "exported_from_id");

export const length = (f: Fact) => _.get(f, "simulation.sample.values.length");

export function hasRequiredProperties(f: Fact) {
  let requiredProperties = ["variable_name", "name"];
  if (!isExportedFromSpace(f)) {
    requiredProperties.push(
      "expression",
      "simulation.sample.values",
      "simulation.stats"
    );
  }

  return _utils.allPresent(requiredProperties.map((prop) => _.get(f, prop)));
}

export function withMissingStats(rawFact: Fact) {
  let fact = _utils.mutableCopy(rawFact);
  _.set(
    fact,
    "simulation.sample.sortedValues",
    sortDescending(_.get(fact, "simulation.sample.values"))
  );

  const length = _.get(fact, "simulation.stats.length");
  const needsACI = length !== undefined && _.isFinite(length) && length > 1;

  // was broken; previously:
  // _.get("simulation.stats.adjustedConfidenceInterval.length");
  // (note the missing first arg)
  const ACIlength = undefined;

  const hasACI = _.isFinite(ACIlength) && ACIlength === 2;
  if (needsACI && !hasACI) {
    _.set(fact, "simulation.stats.adjustedConfidenceInterval", [null, null]);
  }

  return fact;
}

export function selectorSearch(selector, facts) {
  const partial = selector.pop();
  const possibleFacts = _.isEmpty(selector)
    ? facts
    : findBySelector(facts, selector).children;
  if (_.isEmpty(partial) || _.isEmpty(possibleFacts)) {
    return { partial, suggestion: "" };
  }

  const matches = possibleFacts.filter(namedLike(partial));
  if (_.isEmpty(matches)) {
    return { partial, suggestion: "" };
  }

  const suggestion = getVar(matches[0]);
  return { partial, suggestion };
}

function findBySelector(facts, selector, currFact = {}) {
  if (_.isEmpty(selector)) {
    return currFact;
  }
  if (_.isEmpty(facts)) {
    return {};
  }
  const fact = facts.find(byVariableName(selector[0]));
  if (!fact) {
    return {};
  }
  return findBySelector(fact.children, selector.slice(1), fact);
}

const idFrom = (selector) => selector.join(".");
const toMetric = (selector, takenReadableIds) => ({
  id: idFrom(selector),
  readableId: generateRandomReadableId(takenReadableIds),
});
const toGuesstimate = (selector, { expression }) => ({
  metric: idFrom(selector),
  input: expression,
  expression,
});
const toSimulation = (selector, { simulation }) => ({
  ...simulation,
  metric: idFrom(selector),
});

const globalSelector = (handle) => handle.slice(1).split(".");
const orgSelector = (orgId, handle) => [
  `organization_${orgId}`,
  handle.slice(1),
];
export const resolveToSelector = (orgId) => (handle) =>
  handle.startsWith("#") ? orgSelector(orgId, handle) : globalSelector(handle);

export const getFactsForOrg = (facts, org): any[] =>
  !org
    ? []
    : _utils.orArr(
        _collections.gget(
          facts,
          _organization.organizationReadableId(org),
          "variable_name",
          "children"
        )
      );

export function getRelevantFactsAndReformatGlobals(
  { guesstimates }: { guesstimates: Guesstimate[] },
  globalFacts,
  organizationFacts: any[],
  spaceIds
) {
  const rawOrganizationFactsDefined = _collections.filterByInclusion(
    organizationFacts,
    "exported_from_id",
    spaceIds
  );
  const organizationFactsDefined = rawOrganizationFactsDefined.map((f) => ({
    ...f,
    expression: `=${_guesstimate.expressionSyntaxPad(f.metric_id)}`,
  }));

  const organizationFactsUsed = organizationFacts.filter((f) =>
    _.some(guesstimates, (g) =>
      _utils
        .orStr(g.expression)
        .includes(_guesstimate.expressionSyntaxPad(f.id, false))
    )
  );
  const organizationFactsUsedDeDuped = organizationFactsUsed.filter(
    (f) => !_collections.some(organizationFactsDefined, f.id)
  );

  // First we grab the top level global facts (e.g. the fact for 'Chicago') which contain as children subfacts of the
  // population variety. We'll next pre-resolve these into 'fake facts' momentarily.
  const globalFactContainersUsed = globalFacts.filter((f) =>
    _.some(guesstimates, (g) =>
      _utils.orStr(g.expression).includes(f.variable_name)
    )
  );
  const globalFactsUsed = globalFactContainersUsed.map((f) => ({
    ...f.children[0],
    id: `${f.variable_name}.population`,
    variable_name: `@${f.variable_name}.population`,
  }));

  return {
    organizationFactsUsed: [
      ...organizationFactsUsedDeDuped,
      ...organizationFactsDefined,
    ],
    globalFactsUsed,
  };
}

export async function simulateFact(fact: Fact) {
  const guesstimatorInput = { text: fact.expression, guesstimateType: null };
  const formatter = _matchingFormatter(guesstimatorInput);
  const guesstimator = new Guesstimator({
    parsedError: formatter.error(guesstimatorInput),
    parsedInput: formatter.format(guesstimatorInput),
  });
  return guesstimator.sample(NUM_SAMPLES, {});
}
