import _ from "lodash";
import * as spaceActions from "~/modules/spaces/actions";

import * as e from "~/lib/engine/engine";
import { AppThunk } from "~/modules/store";
import { Guesstimate } from "./reducer";

// TODO(matthew): Doing fact/metric translations here means that systems that rely on guesstimate idenity comparisons
// (e.g. action triggering qualifiers) will break.
export function changeGuesstimate(
  metricId: string,
  newGuesstimate: Partial<Guesstimate>,
  shouldRegisterGraphChange = true
): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const metric = state.metrics.find((m) => m.id === metricId);
    if (!metric) {
      throw new Error(`Metric ${metricId} not found`);
    }

    const space = state.spaces.find((space) => space.id === metric.space);
    if (!space) {
      throw new Error(`Space ${metric.space} not found`);
    }

    const possibleFacts = e.space.possibleFacts(
      space,
      state,
      state.facts.organizationFacts
    );
    const factIdsMap = possibleFacts.reduce(
      (map, curr) =>
        _.set(map, `#${curr.variable_name}`, { id: curr.id, isMetric: false }),
      {}
    );

    const metrics = state.metrics.filter((m) => m.space === space.id);
    const metricIdsMap = metrics.reduce(
      (map, curr) =>
        _.set(map, curr.readableId, { id: curr.id, isMetric: true }),
      {}
    );

    const readableIdsMap = { ...metricIdsMap, ...factIdsMap };
    const expression = e.guesstimate.inputToExpression(
      newGuesstimate.input,
      readableIdsMap
    );

    dispatch({
      type: "CHANGE_GUESSTIMATE",
      metricId,
      values: {
        description: "",
        ...newGuesstimate,
        input: null,
        expression,
        metric: metricId,
      } satisfies Guesstimate,
    });

    if (shouldRegisterGraphChange && !!space) {
      dispatch(spaceActions.registerGraphChange(space.id));
    }
  };
}
