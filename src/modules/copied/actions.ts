import _ from "lodash";
import * as e from "~/lib/engine/engine";
import {
  isLocation,
  isWithinRegion,
  Region,
  translate,
} from "~/lib/locationUtils";
import * as metricActions from "~/modules/metrics/actions";
import { selectRegion } from "~/modules/selectedRegion/actions";
import { runSimulations } from "~/modules/simulations/actions";
import { registerGraphChange } from "~/modules/spaces/actions";
import { AppThunk } from "~/modules/store";

import { Metric } from "../metrics/reducer";
import { copiedSlice } from "./reducer";

export function cut(spaceId: number): AppThunk {
  return (dispatch, getState) => {
    dispatch(copy(spaceId));

    const state = getState();
    const region = state.selectedRegion;
    const existingMetrics = state.metrics.filter(
      (m) => m.space === spaceId && isWithinRegion(m.location, region)
    );
    if (existingMetrics.length > 0) {
      dispatch(metricActions.removeMetrics(existingMetrics.map((m) => m.id)));
    }
  };
}

export function copy(spaceId: number): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const region = state.selectedRegion;
    if (!region.length) {
      return; // can't copy empty region
    }

    const metrics = state.metrics.filter(
      (m) => m.space === spaceId && isWithinRegion(m.location, region)
    );
    const guesstimates = metrics
      .map((metric) => state.guesstimates.find((g) => g.metric === metric.id))
      .filter((g): g is NonNullable<typeof g> => !!g);

    dispatch(copiedSlice.actions.copy({ metrics, guesstimates, region }));
  };
}

export function paste(spaceId: number): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    if (
      !(state.copied && state.selectedCell && isLocation(state.selectedCell))
    ) {
      return;
    }

    const { metrics, guesstimates, region } = state.copied;
    const location = state.selectedCell;

    const translateFn = translate(region[0], location);

    const pasteRegion: Region = [location, translateFn(region[1])];

    const spaceMetrics = state.metrics.filter((m) => m.space === spaceId);
    let existingReadableIds = spaceMetrics.map((m) => m.readableId);
    let existingIds = spaceMetrics.map((m) => m.id);

    const idsMap = {};
    const metricsToSimulate: Metric[] = [];
    const newMetrics = metrics.map((metric) => {
      const newMetric: Metric = {
        ...metric,
        space: spaceId,
        location: translateFn(metric.location),
      };
      if (_.some(existingIds, (id) => id === metric.id)) {
        Object.assign(newMetric, e.metric.create(existingReadableIds));
        metricsToSimulate.push(newMetric);
      }

      existingReadableIds = [...existingReadableIds, newMetric.readableId];
      existingIds = [...existingIds, newMetric.id];
      idsMap[metric.id] = newMetric.id;
      return newMetric;
    });

    const newGuesstimates = guesstimates.map((guesstimate, i) =>
      Object.assign(
        {},
        guesstimate,
        { metric: newMetrics[i].id },
        { expression: e.utils.replaceByMap(guesstimate.expression, idsMap) }
      )
    );

    const existingMetrics = spaceMetrics.filter((m) =>
      isWithinRegion(m.location, pasteRegion)
    );
    if (existingMetrics.length > 0) {
      dispatch(metricActions.removeMetrics(existingMetrics.map((m) => m.id)));
    }
    if (newMetrics.length > 0) {
      dispatch({
        type: "ADD_METRICS",
        items: newMetrics,
        newGuesstimates: newGuesstimates,
      });
    }

    dispatch(copiedSlice.actions.paste());
    dispatch(
      runSimulations({
        spaceId,
        simulateSubset: metricsToSimulate.map((m) => m.id),
      })
    );
    dispatch(selectRegion(pasteRegion[0], pasteRegion[1]));
    dispatch(registerGraphChange(spaceId));
  };
}
