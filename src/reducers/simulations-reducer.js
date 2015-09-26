import e from '../lib/engine/engine'
import stats from 'stats-lite'
import _ from 'lodash'

function sStats(simulation){
  if (_.has(simulation, 'sample.values') && (simulation.sample.values.length > 0)) {
    let values = simulation.sample.values;
    return {
      mean:  stats.mean(values),
      stdev:  stats.stdev(values),
      length:  values.length
    };
  }
}

function withStats(simulation){
  let newSim = _.cloneDeep(simulation);
  newSim.stats = sStats(simulation);
  return newSim;
}

export default function simulations(state = [], action = null) {
  switch (action.type) {
  case 'UPDATE_SIMULATION':
    const sim = action.simulation;
    const i = state.findIndex(y => y.metric === sim.metric);
    if (i !== -1) {
      return [
        ...state.slice(0, i),
        withStats(e.simulation.combine([state[i], sim])),
        ...state.slice(i+1, state.length)
      ];
    } else {
      return [...state, withStats(sim)];
    }
  default:
    return state
  }
}
