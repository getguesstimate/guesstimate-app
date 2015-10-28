import e from '../../lib/engine/engine'
import stats from 'stats-lite'
import _ from 'lodash'

function hasNoStdev(values) {
  return (_.uniq(_.slice(values, 0, 5)).length === 1)
}

function sStats(simulation){
  if (_.has(simulation, 'sample.values') && (simulation.sample.values.length > 0)) {
    let values = simulation.sample.values;

    //stats had bug where it would treat very tiny values (< 10^-10) as sometimes having a tiny stdev (<10^-30)
    let stdev = hasNoStdev(values) ? 0 : stats.stdev(values)
    return {
      mean:  stats.mean(values),
      stdev:  stdev,
      length:  values.length
    };
  }
}

function withStats(simulation){
  let newSim = _.cloneDeep(simulation);
  newSim.stats = sStats(simulation);
  return newSim;
}

let sim = null;
export default function simulations(state = [], action = null) {
  switch (action.type) {
  case 'SPACES_FETCH_SUCCESS':
    let newSimulations = _.flatten(action.records.map(e => _.get(e, 'graph.simulations'))).filter(e => e)
    return [...state, ...newSimulations]
  case 'DELETE_SIMULATIONS':
    return state.filter(y => !_.includes(action.metricIds, y.metric))
  case 'UPDATE_SIMULATION':
    sim = action.simulation;
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
