import * as metricActions from 'gModules/metrics/actions'
import {runSimulations} from 'gModules/simulations/actions'

import e from 'gEngine/engine'

import {isAtLocation, isWithinRegion, getBounds, move} from 'lib/locationUtils'

export function selectFillRegion(corner1, corner2) {
  let leftX, topY, rightX, bottomY
  leftX = Math.min(corner1.row, corner2.row)
  topY = Math.max(corner1.column, corner2.column)
  rightX = Math.max(corner1.row, corner2.row)
  bottomY = Math.min(corner1.column, corner2.column)
  return { type: 'SELECT_FILL_REGION', corner1: {row: leftX, column: bottomY}, corner2: {row: rightX, column: topY} }
}

export function deSelectFillRegion() {
  return { type: 'DE_SELECT_FILL_REGION' }
}

const CONSTANT_FILL_TYPES = ['POINT', 'NONE', 'DATA']

const getDirAndLen = (start, end) => ({
  direction: {row: Math.sign(end.row - start.row), column: Math.sign(end.column - start.column)},
  length: Math.abs(start.row - end.row) || Math.abs(start.column - end.column),
})

function fillFunction(startMetric, startGuesstimate, metrics, guesstimates, idMap, newLocation) {
}

function addAtLoc(startMetric, startGuesstimate, metrics, guesstimates, idMap, newLocation) {
  const metric = {...startMetric, ...e.metric.create(Object.keys(idMap)), location: newLocation}
  return {
    metric,
    guesstimate: {...startGuesstimate, metric: metric.id},
  }
}

function buildNewMetrics(startMetric, startGuesstimate, startLocation, {direction, length}, metrics, guesstimates) {
  const {guesstimateType, input} = startGuesstimate

  let newMetrics = []
  let newGuesstimates = []

  const translateFn = CONSTANT_FILL_TYPES.includes(guesstimateType) ? 
    (loc, metrics, guesstimates, idMap) => addAtLoc(startMetric, startGuesstimate, metrics, guesstimates, idMap, loc)
      :
    (loc, metrics, guesstimates, idMap) => fillFunction(startMetric, startGuesstimate, metrics, guesstimates, idMap, loc)

  let idMap = {}
  metrics.forEach(m => {idMap[m.readableId] = m.id})

  let currLocation = move(startLocation, direction)
  for (var i = 0; i < length; i++) {
    const {metric, guesstimate} = translateFn(currLocation, metrics.concat(newMetrics), guesstimates.concat(newGuesstimates), idMap)
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

    const containedMetrics = metrics.filter(m => m.id !== startMetric.id && isWithinRegion(m.location, getBounds({start, end})))
    dispatch(metricActions.removeMetrics(containedMetrics.map(m => m.id)))

    if (!startMetric) { return }

    const startGuesstimate = guesstimates.find(g => g.metric === startMetric.id)

    const {newMetrics, newGuesstimates} = buildNewMetrics(startMetric, startGuesstimate, start, getDirAndLen(start, end), metrics, guesstimates)

    dispatch({type: 'ADD_METRICS', items: newMetrics, newGuesstimates: newGuesstimates})

    dispatch(runSimulations({spaceId, metricSubset: newMetrics}))
  }
}
