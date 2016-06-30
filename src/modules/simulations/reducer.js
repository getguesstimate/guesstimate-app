import e from 'lib/engine/engine'
import {sampleMean, sampleStdev, percentile, cutoff, sortDescending} from 'lib/dataAnalysis.js'

function addStats(simulation){
  if (!_.has(simulation, 'sample.values.length') || (simulation.sample.values.length === 0)) {
    return
  } else if (simulation.sample.values.length === 1) {
    simulation.stats = {
      mean: simulation.sample.values[0],
      stdev: 0,
      length: 1,
    }
    simulation.sample.sortedValues = simulation.sample.values
    return
  }

  const sortedValues = sortDescending(simulation.sample.values)
  const length = sortedValues.length
  const mean = sampleMean(sortedValues)
  const meanIndex = cutoff(sortedValues, length, mean)
  const stdev = sampleStdev(sortedValues)
  const percentiles = {
    5: percentile(sortedValues, length, 5),
    50: percentile(sortedValues, length, 50),
    95: percentile(sortedValues, length, 95),
  }
  const adjustedLow = percentile(sortedValues, meanIndex, 10)
  const adjustedHigh = percentile(sortedValues.slice(meanIndex), length - meanIndex, 90)

  const stats = {
    mean,
    stdev,
    length,
    percentiles,
    adjustedConfidenceInterval: [adjustedLow, adjustedHigh]
  }
  simulation.sample.sortedValues = sortedValues
  simulation.stats = stats
}

export default function simulations(state = [], action = null) {
  switch (action.type) {
    case 'DELETE_SIMULATIONS':
      return state.filter(y => !_.includes(action.metricIds, y.metric))
    case 'UPDATE_SIMULATION':
      let sim = action.simulation
      // We modify the sim in place, adding stats and sorted values, before saving.
      addStats(sim)

      const i = state.findIndex(y => y.metric === sim.metric)
      if (i !== -1) {
        return [
          ...state.slice(0, i),
          sim,
          ...state.slice(i+1, state.length)
        ]
      } else {
        return [...state, sim]
      }
    default:
      return state
  }
}
