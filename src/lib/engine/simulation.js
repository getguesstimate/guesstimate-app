import * as sample from './sample'

import {sampleMean, sampleStdev, percentile, cutoff, sortDescending} from 'lib/dataAnalysis.js'

export function addStats(simulation){
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

export function combine(simulations) {
  let recentSimulations = simulations

  if (_.some(simulations, s => s.propagationId)) {
    const recentPropagation = _.max(simulations.map(s => s.propagationId))
    recentSimulations = simulations.filter(s => {return s.propagationId === recentPropagation})
  }

  return {
    metric: recentSimulations[0].metric,
    propagationId: recentSimulations[0].propagationId,
    sample: sample.combine(recentSimulations.map(s => s.sample))
  }
}

export function hasValues(simulation) {
  return (values(simulation).length > 0)
}

export function values(simulation) {
  return _.get(simulation, 'sample.values') || []
}

export function hasErrors(simulation) {
  return errors(simulation).length > 0
}

export function errors(simulation) {
  return _.get(simulation, 'sample.errors') || []
}
