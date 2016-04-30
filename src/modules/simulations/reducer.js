import e from 'lib/engine/engine'
import _ from 'lodash'
import {sampleMean, sampleStdev, percentile, cutoff, sortDescending} from 'lib/dataAnalysis.js'

function sStats(simulation){
  if (!_.has(simulation, 'sample.values') || (simulation.sample.values.length === 0)) {
    return
  }
  const samples = sortDescending(simulation.sample.values)
  const length = samples.length
  const mean = sampleMean(samples)
  const meanIndex = cutoff(samples, length, mean)
  const stdev = sampleStdev(samples)
  const percentiles = {
    5: percentile(samples, length, 5),
    50: percentile(samples, length, 50),
    95: percentile(samples, length, 95),
  }
  const adjustedLow = percentile(samples, meanIndex, 10)
  const adjustedHigh = percentile(samples.slice(meanIndex), length - meanIndex, 90)

  return {
    mean,
    stdev,
    length,
    percentiles,
    adjustedConfidenceInterval: [adjustedLow, adjustedHigh]
  };
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
    const sim = withStats(action.simulation);
    const i = state.findIndex(y => y.metric === sim.metric);
    if (i !== -1) {
      const newState =  [
        ...state.slice(0, i),
        sim,
        ...state.slice(i+1, state.length)
      ];
      return newState
    } else {
      return [...state, sim];
    }
  default:
    return state
  }
}
