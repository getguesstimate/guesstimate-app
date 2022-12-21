import { addStats } from "gEngine/simulation";

export default function simulations(state = [], action = null) {
  switch (action.type) {
    case "DELETE_SIMULATIONS":
      return state.filter((s) => !_.includes(action.metricIds, s.metric));
    case "UPDATE_SIMULATION":
      let sim = action.simulation;
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
}
