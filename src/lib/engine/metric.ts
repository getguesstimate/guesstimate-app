import uuid from "node-uuid";

import * as _guesstimate from "./guesstimate";
import * as _collections from "./collections";

import generateRandomReadableId from "./metric/generate_random_readable_id";
import { isAtLocation } from "~/lib/locationUtils";
import { RootState } from "~/modules/store";
import { Metric } from "~/modules/metrics/reducer";
import { Guesstimate } from "~/modules/guesstimates/reducer";
import { Simulation } from "~/modules/simulations/reducer";

export type DenormalizedMetric = Metric & {
  guesstimate: Guesstimate;
  simulation: Simulation;
};

export function equals(l: Metric, r: Metric) {
  return (
    l.name === r.name &&
    l.readableId === r.readableId &&
    isAtLocation(l.location, r.location)
  );
}

export function create(metricNames: string[]) {
  return {
    id: uuid.v1() as string,
    readableId: generateRandomReadableId(metricNames),
  };
}

export function denormalizeFn(
  graph: Pick<RootState, "guesstimates" | "simulations">
): (m: Metric) => DenormalizedMetric {
  return (metric) => {
    const findWithMetricId = (collection) =>
      _collections.get(collection, metric.id, "metric");
    const guesstimate = findWithMetricId(graph.guesstimates);
    const simulation = findWithMetricId(graph.simulations);
    return { ...metric, guesstimate, simulation };
  };
}
