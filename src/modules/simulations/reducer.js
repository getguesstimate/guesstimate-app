import e from '../../lib/engine/engine'
import _ from 'lodash'
import {Stats} from 'fast-stats'

function hasNoStdev(values) {
  return (_.uniq(_.slice(values, 0, 5)).length === 1)
}

window.stats = Stats
function sStats(simulation){
  if (_.has(simulation, 'sample.values') && (simulation.sample.values.length > 0)) {
    let values = simulation.sample.values;
    let s1 = new Stats().push(values)

    //stats had bug where it would treat very tiny values (< 10^-10) as sometimes having a tiny stdev (<10^-30)
    const percentiles = {5: s1.percentile(5), 50: s1.percentile(50), 95: s1.percentile(95)}
    let stdev = hasNoStdev(values) ? 0 : s1.stddev()
    const mean = s1.amean()
    const stats = Stats
    const lowValue = (new Stats().push(values.filter(e => e < mean))).percentile(10)
    const highValue = (new Stats().push(values.filter(e => e > mean))).percentile(90)
    return {
      mean,
      stdev:  stdev,
      length:  values.length,
      percentiles,
      adjustedPercentiles: {
        5: lowValue,
        95: highValue
      }
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
      const newState =  [
        ...state.slice(0, i),
        withStats(sim),
        ...state.slice(i+1, state.length)
      ];
      return newState
    } else {
      return [...state, withStats(sim)];
    }
  default:
    return state
  }
}
