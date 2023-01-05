import _ from "lodash";

import {
  runSimulations,
  deleteSimulations,
} from "~/modules/simulations/actions";
import { registerGraphChange } from "~/modules/spaces/actions";

import * as e from "~/lib/engine/engine";

import {
  isAtLocation,
  isWithinRegion,
  getBounds,
  move,
  translate,
  CanvasLocation,
  DirectionVector,
} from "~/lib/locationUtils";
import { AppThunk } from "~/modules/store";
import { Metric } from "../metrics/reducer";
import { Guesstimate } from "../guesstimates/reducer";

const DYNAMIC_FILL_TYPE = "FUNCTION";

// TODO(matthew): Dry up code with this and copy and undo.

function getDirAndLen(start: CanvasLocation, end: CanvasLocation) {
  return {
    direction: {
      row: Math.sign(end.row - start.row),
      column: Math.sign(end.column - start.column),
    },
    length:
      Math.abs(start.row - end.row) || Math.abs(start.column - end.column),
  };
}

function buildNewMetric(startMetric: Metric, metrics, location) {
  const metricId =
    metrics.find((m) => isAtLocation(m.location, location)) ||
    e.metric.create(metrics.map((m) => m.readableId));
  return {
    ...startMetric,
    ..._.pick(metricId, ["id", "readableId"]),
    location,
  };
}

function isNonConstant({ location, name }: Metric, direction, metrics) {
  return (
    _.some(metrics, (m) =>
      isAtLocation(move(location, direction), m.location)
    ) || _.isEmpty(name)
  );
}

// TODO(matthew): Make this not exported (Test through the public API)
export function fillDynamic(
  startMetric: Metric,
  startGuesstimate: Guesstimate,
  direction
) {
  const { expression } = startGuesstimate;
  return (location: CanvasLocation, metrics: Metric[]) => {
    const metric = buildNewMetric(startMetric, metrics, location);

    const nonConstantMetrics = metrics.filter((m) =>
      isNonConstant(m, direction, metrics)
    );
    if (_.isEmpty(nonConstantMetrics)) {
      return {
        metric,
        guesstimate: { ...startGuesstimate, metric: metric.id },
      };
    }

    const nonConstantInputsRegex = e.utils.or(
      nonConstantMetrics.map((m) =>
        e.guesstimate.expressionSyntaxPad(m.id, true)
      )
    );
    const numNonConstantInputs = (
      expression.match(nonConstantInputsRegex) || []
    ).length;

    const translateFn = translate(startMetric.location, location);
    let idMap = {};
    nonConstantMetrics.forEach((m) => {
      const matchedMetric = metrics.find((m2) =>
        isAtLocation(translateFn(m.location), m2.location)
      );
      if (!!matchedMetric) {
        idMap[e.guesstimate.expressionSyntaxPad(m.id, true)] =
          e.guesstimate.expressionSyntaxPad(matchedMetric.id, true);
      }
    });
    if (_.isEmpty(idMap)) {
      if (numNonConstantInputs === 0) {
        return {
          metric,
          guesstimate: { ...startGuesstimate, metric: metric.id },
        };
      } else {
        return {};
      }
    }

    const translatableInputsRegex = e.utils.or(Object.keys(idMap));
    const numTranslatedInputs =
      numNonConstantInputs === 0
        ? 0
        : (expression.match(translatableInputsRegex) || []).length;

    if (numNonConstantInputs !== numTranslatedInputs) {
      return {};
    }

    return {
      metric,
      guesstimate: {
        ...startGuesstimate,
        metric: metric.id,
        expression: e.utils.replaceByMap(expression, idMap),
      },
    };
  };
}

function fillStatic(startMetric: Metric, startGuesstimate: Guesstimate) {
  return (location: CanvasLocation, metrics: Metric[]) => {
    const metric = buildNewMetric(startMetric, metrics, location);
    return { metric, guesstimate: { ...startGuesstimate, metric: metric.id } };
  };
}

function buildNewMetrics(
  startMetric: Metric,
  startGuesstimate: Guesstimate,
  { direction, length }: { direction: DirectionVector; length: number },
  metrics: Metric[]
) {
  const { guesstimateType } = startGuesstimate;

  let newMetrics: Metric[] = []; // FIXME
  let newGuesstimates: Guesstimate[] = [];

  const isDynamic = guesstimateType === DYNAMIC_FILL_TYPE;
  const translateFn = (isDynamic ? fillDynamic : fillStatic)(
    startMetric,
    startGuesstimate,
    direction
  );

  let currLocation = move(startMetric.location, direction);
  for (let i = 0; i < length; i++) {
    const { metric, guesstimate } = translateFn(
      currLocation,
      metrics.concat(newMetrics)
    );
    if (!!metric) {
      newMetrics.push(metric);
    }
    if (!!guesstimate) {
      newGuesstimates.push(guesstimate);
    }
    currLocation = move(currLocation, direction);
  }

  return { newMetrics, newGuesstimates };
}

export function fillRegion(
  spaceId: number,
  { start, end }: { start: CanvasLocation; end: CanvasLocation }
): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const metrics = state.metrics.filter((m) => m.space === spaceId);

    const startMetric = metrics.find((m) => isAtLocation(m.location, start));

    const fillRegion = getBounds({ start, end });
    const containedMetrics = metrics.filter(
      (m) =>
        m.id !== _.get(startMetric, "id") &&
        isWithinRegion(m.location, fillRegion)
    );
    dispatch({
      type: "REMOVE_METRICS",
      item: { ids: containedMetrics.map((m) => m.id) },
    });
    dispatch(deleteSimulations(containedMetrics.map((m) => m.id)));

    if (!startMetric) {
      return;
    }

    const startGuesstimate = state.guesstimates.find(
      (g) => g.metric === startMetric.id
    );
    if (!startGuesstimate) {
      return;
    }

    const { newMetrics, newGuesstimates } = buildNewMetrics(
      startMetric,
      startGuesstimate,
      getDirAndLen(start, end),
      metrics
    );

    dispatch({
      type: "ADD_METRICS",
      items: newMetrics,
      newGuesstimates: newGuesstimates,
    });
    dispatch(
      runSimulations({ spaceId, simulateSubset: newMetrics.map((m) => m.id) })
    );
    dispatch(registerGraphChange(spaceId));
  };
}
