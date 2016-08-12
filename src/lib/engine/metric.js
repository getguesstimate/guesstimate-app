import uuid from 'node-uuid'

import * as _guesstimate from './guesstimate'
import * as _collections from './collections'

import generateRandomReadableId from './metric/generate_random_readable_id'
import {isAtLocation} from 'lib/locationUtils'

export function equals(l, r) {
  return (
    l.name === r.name &&
    l.readableId === r.readableId &&
    isAtLocation(l.location, r.location)
  )
}

export function create(metricNames) {
  return {
    id: uuid.v1(),
    readableId: generateRandomReadableId(metricNames)
  }
}

export function denormalizeFn(graph) {
  return metric => {
    const findWithMetricId = collection => _collections.get(collection, metric.id, 'metric')
    const guesstimate = findWithMetricId(graph.guesstimates)
    const simulation = findWithMetricId(graph.simulations)
    return {...metric, guesstimate, simulation}
  }
}
