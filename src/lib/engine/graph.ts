import { RootState } from "~/modules/store";
import _ from "lodash";
import * as _metric from "./metric";
import { isPresent } from "./utils";
import { MetricEdges } from "./space";

export const INTERMEDIATE = "INTERMEDIATE";
export const OUTPUT = "OUTPUT";
export const INPUT = "INPUT";
export const NOEDGE = "NOEDGE";

type RelationshipType =
  | typeof INTERMEDIATE
  | typeof OUTPUT
  | typeof INPUT
  | typeof NOEDGE;

export function relationshipType(edges: MetricEdges): RelationshipType {
  if (!_.isEmpty(edges.inputs) && !_.isEmpty(edges.outputs)) {
    return INTERMEDIATE;
  }
  if (!_.isEmpty(edges.inputs)) {
    return OUTPUT;
  }
  if (!_.isEmpty(edges.outputs)) {
    return INPUT;
  }
  return NOEDGE;
}

export const denormalize = (
  graph: Pick<RootState, "metrics" | "guesstimates" | "simulations">
) => ({
  metrics: graph.metrics.map(_metric.denormalizeFn(graph)).filter(isPresent),
});
