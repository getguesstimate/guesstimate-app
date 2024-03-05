import _ from "lodash";
import { addStats } from "~/lib/engine/simulation";
import { AnyAction, Reducer } from "redux";
import { SampleValue } from "~/lib/guesstimator/samplers/Simulator";
import { PropagationError } from "~/lib/propagation/errors";

export type Simulation = {
  metric?: string;
  stats?: any;
  propagationId?: number;
  sample: {
    values?: SampleValue[];
    sortedValues?: number[];
    errors?: PropagationError[];
  };
};

type SimulationsState = Simulation[];

export const simulationsR: Reducer<SimulationsState, AnyAction> = (
  state = [],
  action
) => {
  switch (action.type) {
    case "DELETE_SIMULATIONS":
      return state.filter((s) => !_.includes(action.metricIds, s.metric));
    case "UPDATE_SIMULATION":
      const sim = action.simulation;
      // We modify the sim in place, adding stats and sorted values, before saving.
      addStats(sim);

      const i = state.findIndex((y) => y.metric === sim.metric);
      if (i !== -1) {
        return [...state.slice(0, i), sim, ...state.slice(i + 1, state.length)];
      } else {
        return [...state, sim];
      }
    default:
      return state;
  }
};
