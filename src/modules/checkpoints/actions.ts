import * as engine from "gEngine/engine";
import { AppThunk } from "gModules/store";
import _ from "lodash";

export function saveCheckpoint(spaceId, newGraph): AppThunk {
  return (dispatch, getState) => {
    dispatch({ type: "SAVE_CHECKPOINT", checkpoint: newGraph, spaceId });
  };
}

export function initSpace(spaceId, graph): AppThunk {
  return (dispatch, getState) => {
    const { metrics, guesstimates } = graph;
    dispatch({
      type: "INITIALIZE",
      checkpoint: {
        guesstimates,
        metrics: metrics.map((m) => Object.assign({}, m, { space: spaceId })),
      },
      spaceId,
    });
  };
}

function updateMetricsAndGuesstimates(
  dispatch,
  getState,
  spaceId,
  oldMetrics,
  newMetrics,
  oldGuesstimates,
  newGuesstimates
) {
  const metricsToAdd = newMetrics.filter(
    (m) => !_.some(oldMetrics, (o) => o.id === m.id)
  );
  const metricsToDelete = oldMetrics.filter(
    (m) => !_.some(newMetrics, (n) => n.id === m.id)
  );
  const metricsToModify = newMetrics.filter((m) => {
    const matchedMetric = _.find(oldMetrics, (o) => o.id === m.id);
    return !!matchedMetric && !engine.metric.equals(matchedMetric, m);
  });

  const guesstimatesToAdd = newGuesstimates.filter((g) =>
    _.some(metricsToAdd, (m) => m.id === g.metric)
  );
  const guesstimatesToModify = newGuesstimates.filter((g) => {
    const matchedGuesstimate = _.find(
      oldGuesstimates,
      (o) => o.metric === g.metric
    );
    return (
      !!matchedGuesstimate && !engine.guesstimate.equals(matchedGuesstimate, g)
    );
  });

  const guesstimatesToReSimulate = guesstimatesToModify.filter(
    (newGuesstimate) => {
      const oldGuesstimate = engine.collections.get(
        oldGuesstimates,
        newGuesstimate.metric,
        "metric"
      );
      return (
        oldGuesstimate.expression !== newGuesstimate.expression ||
        oldGuesstimate.guesstimateType !== newGuesstimate.guesstimateType
      );
    }
  );

  dispatch({
    type: "ADD_METRICS",
    items: metricsToAdd,
    newGuesstimates: guesstimatesToAdd,
  });
  dispatch({
    type: "REMOVE_METRICS",
    item: { ids: metricsToDelete.map((m) => m.id) },
  });
  metricsToModify.forEach((m) => {
    dispatch({ type: "CHANGE_METRIC", item: m });
  });
  guesstimatesToModify.forEach((g) => {
    const formatted = engine.guesstimate.format(g);
    dispatch({
      type: "CHANGE_GUESSTIMATE",
      metricId: g.metric,
      values: formatted,
    });
  });

  dispatch({
    type: "RUN_UNDO_SIMULATIONS",
    getState,
    dispatch,
    spaceId,
    metricIds: guesstimatesToReSimulate.map((g) => g.metric),
  });
}

export function undo(spaceId): AppThunk {
  return (dispatch, getState) => {
    const spaceCheckpoints = getState().checkpoints.find(
      (r) => r.spaceId === spaceId
    );
    if (!spaceCheckpoints) {
      return;
    }

    const { head, checkpoints } = spaceCheckpoints;
    if (head === checkpoints.length - 1) {
      return;
    }
    const newGraph = checkpoints[head + 1];
    const { metrics, guesstimates } = getState();
    updateMetricsAndGuesstimates(
      dispatch,
      getState,
      spaceId,
      metrics,
      newGraph.metrics,
      guesstimates,
      newGraph.guesstimates
    );

    dispatch({
      type: "UPDATE_FOR_SPACE",
      spaceId,
      newCheckpoints: { spaceId, head: head + 1, checkpoints },
    });
  };
}

export function redo(spaceId): AppThunk {
  return (dispatch, getState) => {
    const { head, checkpoints } = getState().checkpoints.find(
      (r) => r.spaceId === spaceId
    );
    if (head === 0) {
      return;
    }
    const newGraph = checkpoints[head - 1];
    const { metrics, guesstimates } = getState();
    updateMetricsAndGuesstimates(
      dispatch,
      getState,
      spaceId,
      metrics,
      newGraph.metrics,
      guesstimates,
      newGraph.guesstimates
    );

    dispatch({
      type: "UPDATE_FOR_SPACE",
      spaceId,
      newCheckpoints: { spaceId, head: head - 1, checkpoints },
    });
  };
}
