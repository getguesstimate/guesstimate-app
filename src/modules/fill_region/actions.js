import * as metricActions from 'gModules/metrics/actions'
import {runSimulations} from 'gModules/simulations/actions'

import e from 'gEngine/engine'

import {isAtLocation, isWithinRegion, getBounds, move, translate} from 'lib/locationUtils'

const DYNAMIC_FILL_TYPES = ['FUNCTION']

// TODO(matthew): Dry up code with this and copy and undo perhaps.
function translateReadableIds(input, idMap) {
  if (!input) {return ""}
  const re = RegExp(Object.keys(idMap).join("|"), "g")
  return input.replace(re, (match) => idMap[match])
}

const getDirAndLen = (start, end) => ({
  direction: {row: Math.sign(end.row - start.row), column: Math.sign(end.column - start.column)},
  length: Math.abs(start.row - end.row) || Math.abs(start.column - end.column),
})

function fillFunction(startMetric, startGuesstimate, metrics, idMap2, newLocation) {
  const metric = {...startMetric, ...e.metric.create(Object.keys(idMap2)), location: newLocation}
  const {input} = startGuesstimate
  const translateFn = translate(startMetric.location, newLocation)
  let idMap = {}
  metrics.forEach(m => {
    const matchedMetric = metrics.find(m2 => isAtLocation(translateFn(m.location), m2.location))
    if (!!matchedMetric) { idMap[m.readableId] = matchedMetric.readableId }
  })

  return { metric, guesstimate: {...startGuesstimate, metric: metric.id, input: translateReadableIds(input, idMap)} }
}

function addAtLoc(startMetric, startGuesstimate, metrics, idMap, newLocation) {
  const metric = {...startMetric, ...e.metric.create(Object.keys(idMap)), location: newLocation}
  return { metric, guesstimate: {...startGuesstimate, metric: metric.id} }
}

function buildNewMetrics(startMetric, startGuesstimate, startLocation, {direction, length}, metrics, guesstimates) {
  const {guesstimateType, input} = startGuesstimate

  let newMetrics = []
  let newGuesstimates = []

  const translateFn = DYNAMIC_FILL_TYPES.includes(guesstimateType) ? 
    (loc, metrics, idMap) => fillFunction(startMetric, startGuesstimate, metrics, idMap, loc)
      :
    (loc, metrics, idMap) => addAtLoc(startMetric, startGuesstimate, metrics, idMap, loc)

  let idMap = {}
  metrics.forEach(m => {idMap[m.readableId] = m.id})

  let currLocation = move(startLocation, direction)
  for (var i = 0; i < length; i++) {
    const {metric, guesstimate} = translateFn(currLocation, metrics.concat(newMetrics), idMap)
    idMap[metric.readableId] = metric.id
    newMetrics.push(metric)
    newGuesstimates.push(guesstimate)
    currLocation = move(currLocation, direction)
  }

  return {newMetrics, newGuesstimates}
}

export function fillRegion(spaceId, {start, end}) {
  return (dispatch, getState) => {
    const state = getState()

    const metrics = state.metrics.filter(m => m.space === spaceId)
    const guesstimates = state.guesstimates.filter(g => _.some(metrics, m => m.id === g.metric))

    const startMetric = metrics.find(m => isAtLocation(m.location, start))

    const containedMetrics = metrics.filter(m => (!startMetric || m.id !== startMetric.id) && isWithinRegion(m.location, getBounds({start, end})))
    dispatch(metricActions.removeMetrics(containedMetrics.map(m => m.id)))

    if (!startMetric) { return }

    const startGuesstimate = guesstimates.find(g => g.metric === startMetric.id)

    const {newMetrics, newGuesstimates} = buildNewMetrics(startMetric, startGuesstimate, start, getDirAndLen(start, end), metrics, guesstimates)

    dispatch({type: 'ADD_METRICS', items: newMetrics, newGuesstimates: newGuesstimates})

    dispatch(runSimulations({spaceId, metricSubset: newMetrics}))
  }
}
