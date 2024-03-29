import _ from "lodash";
import { AnyAction, Reducer } from "redux";
import { uniq } from "~/lib/engine/collections";
import { CanvasLocation } from "~/lib/locationUtils";

export type Metric = {
  space: number;
  location: CanvasLocation;
  id: string;
  readableId: string;
  name?: string;
};

type MetricsState = Metric[];

function spaceToMetrics(space) {
  const metrics = _.get(space, "graph.metrics");
  return _.isEmpty(metrics)
    ? []
    : metrics.map((m) => ({ ...m, space: space.id }));
}

export const metricsR: Reducer<MetricsState, AnyAction> = (
  state = [],
  action
) => {
  switch (action.type) {
    case "CALCULATORS_FETCH_SUCCESS": {
      const newMetrics = spaceToMetrics(_.get(action, "data.space")) || [];
      return uniq([...state, ...newMetrics]);
    }
    case "SPACES_FETCH_SUCCESS": {
      const newMetrics = _.flatten(
        action.records.map((e) => spaceToMetrics(e))
      ).filter((e) => e);
      return uniq([...state, ...newMetrics]);
    }
    case "SPACES_CREATE_SUCCESS": {
      if (!_.has(action, "record.graph.metrics")) {
        return state;
      }
      const newMetrics = spaceToMetrics(action.record).filter((e) => e);
      return uniq([...state, ...newMetrics]);
    }
    case "ADD_METRIC":
      return uniq([...state, action.item]);
    case "ADD_METRICS":
      return uniq([...state, ...action.items]);
    case "REMOVE_METRICS":
      return state.filter((y) => !_.some(action.item.ids, (id) => y.id === id));
    case "CHANGE_METRIC": {
      const i = state.findIndex((y) => y.id === action.item.id);
      if (i !== -1) {
        return [
          ...state.slice(0, i),
          { ...state[i], ...action.item },
          ...state.slice(i + 1, state.length),
        ];
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};
