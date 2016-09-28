import * as _collections from './collections'
import * as _utils from './utils'

import {sampleMean, sampleStdev, percentile, cutoff, sortDescending} from 'lib/dataAnalysis.js'

export const NUM_SAMPLES = 5000
export const METRIC_ID_PREFIX = 'metric:'
export const FACT_ID_PREFIX = 'fact:'

export const getByMetricFn = graph => _collections.getFn(_.get(graph, 'simulations'), 'metric', 'metric')

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
  const adjustedLow = meanIndex === -1 ? sortedValues[0] : percentile(sortedValues, meanIndex, 10)
  const adjustedHigh = meanIndex === -1 ? sortedValues[0] : percentile(sortedValues.slice(meanIndex), length - meanIndex, 90)

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

export const hasErrors = simulation => errors(simulation).length > 0
export const errors = simulation => _utils.orArr(_.get(simulation, 'sample.errors'))
export const values = simulation => _utils.orArr(_.get(simulation, 'sample.values'))
