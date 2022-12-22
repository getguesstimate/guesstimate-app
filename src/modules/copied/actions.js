import * as e from "gEngine/engine";
import * as metricActions from "gModules/metrics/actions";
import { selectRegion } from "gModules/selected_region/actions";
import { runSimulations } from "gModules/simulations/actions";
import { registerGraphChange } from "gModules/spaces/actions";

import { isLocation, isWithinRegion, translate } from "lib/locationUtils";

export function cut(spaceId) {
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

export function copy(spaceId) {
  return (dispatch, getState) => {
    const state = getState();

    const region = state.selectedRegion;
    const metrics = state.metrics.filter(
      (m) => m.space === spaceId && isWithinRegion(m.location, region)
    );
    const guesstimates = metrics.map((metric) =>
      state.guesstimates.find((g) => g.metric === metric.id)
    );

    dispatch({ type: "COPY", copied: { metrics, guesstimates, region } });
  };
}

export function paste(spaceId) {
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

    const pasteRegion = [location, translateFn(region[1])];

    const spaceMetrics = state.metrics.filter((m) => m.space === spaceId);
    let existingReadableIds = spaceMetrics.map((m) => m.readableId);
    let existingIds = spaceMetrics.map((m) => m.id);

    let idsMap = {};
    let metricsToSimulate = [];
    const newMetrics = _.map(metrics, (metric) => {
      let newMetric = {
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

    const newGuesstimates = _.map(guesstimates, (guesstimate, i) =>
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

    dispatch({ type: "PASTE" });
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
