import uuid from "node-uuid";

import * as _collections from "./collections";

import { isAtLocation } from "~/lib/locationUtils";
import { Guesstimate } from "~/modules/guesstimates/reducer";
import { Metric } from "~/modules/metrics/reducer";
import { Simulation } from "~/modules/simulations/reducer";
import { RootState } from "~/modules/store";
import { generateRandomReadableId } from "./metric/generate_random_readable_id";

export type DenormalizedMetric = Metric & {
  guesstimate: Guesstimate;
  simulation: Simulation | null | undefined;
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
    const findWithMetricId = <T>(collection: T[]) =>
      _collections.get(collection, metric.id, "metric");

    const guesstimate = findWithMetricId(graph.guesstimates);
    const simulation = findWithMetricId(graph.simulations);
    if (!guesstimate) {
      throw new Error("Guesstimate not found");
    }
    return { ...metric, guesstimate, simulation };
  };
}
