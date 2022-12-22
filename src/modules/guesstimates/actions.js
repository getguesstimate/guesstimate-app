import * as spaceActions from "gModules/spaces/actions";

import * as e from "gEngine/engine";

// TODO(matthew): Doing fact/metric translations here means that systems that rely on guesstimate idenity comparisons
// (e.g. action triggering qualifiers) will break.
export function changeGuesstimate(
  metricId,
  newGuesstimate,
  shouldRegisterGraphChange = true
) {
  return (dispatch, getState) => {
    const state = getState();

    const metric = e.collections.get(state.metrics, metricId);
    const space = e.collections.get(state.spaces, _.get(metric, "space"));

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
      values: { ...newGuesstimate, input: null, expression, metric: metricId },
    });

    if (shouldRegisterGraphChange && !!space) {
      dispatch(spaceActions.registerGraphChange(space.id));
    }
  };
}
