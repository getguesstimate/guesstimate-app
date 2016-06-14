import * as metricActions from 'gModules/metrics/actions'
import {runSimulations, deleteSimulations} from 'gModules/simulations/actions'
import {registerGraphChange} from 'gModules/spaces/actions'

import e from 'gEngine/engine'

import {isAtLocation, isWithinRegion, getBounds, move, translate} from 'lib/locationUtils'

const DYNAMIC_FILL_TYPE = 'FUNCTION'

// TODO(matthew): Dry up code with this and copy and undo perhaps.
function translateReadableIds(input, idMap) {
  if (!input || _.isEmpty(idMap)) {return input}
  const re = RegExp(Object.keys(idMap).join("|"), "g")
  return input.replace(re, (match) => idMap[match])
}

const getDirAndLen = (start, end) => ({
  direction: {row: Math.sign(end.row - start.row), column: Math.sign(end.column - start.column)},
  length: Math.abs(start.row - end.row) || Math.abs(start.column - end.column),
})

function fillDynamicSkipUnlessPossible(startMetric, startGuesstimate) {
  return (location, metrics) => {
    const metric = {...startMetric, ...e.metric.create(metrics.map(m => m.readableId)), location}
    const inputsRegex = RegExp(metrics.map(m => m.readableId).join('|'), "g")

    const {input} = startGuesstimate
    const numInputs = !!input.match(inputsRegex) ? input.match(inputsRegex).length : 0

    const translateFn = translate(startMetric.location, location)
    let idMap = {}
    metrics.forEach(m => {
      const matchedMetric = metrics.find(m2 => isAtLocation(translateFn(m.location), m2.location))
      if (!!matchedMetric) { idMap[m.readableId] = matchedMetric.readableId }
    })
    const re = RegExp(Object.keys(idMap).join("|"), "g")
    const translatableIds = !!input.match(re) ? input.match(re).length : 0

    if (numInputs !== translatableIds) {
      return {}
    }

    return { metric, guesstimate: {...startGuesstimate, metric: metric.id, input: translateReadableIds(input, idMap)} }
  }
}

function fillIntelligent(startMetric, startGuesstimate, direction) {
  return (location, metrics) => {
    const metricIds = metrics.find(m => isAtLocation(m.location, location)) || e.metric.create(metrics.map(m => m.readableId))
    const metric = {...startMetric, ..._.pick(metricIds, ['id', 'readableId']), location}

    const translatableMetrics = metrics.filter(m => (
      _.some(metrics, m2 => isAtLocation(move(m.location, direction), m2.location)) || !m.name
    ))

    const translatableInputsRegex = RegExp(translatableMetrics.map(m => m.readableId).join('|'), "g")

    const {input} = startGuesstimate
    const numInputs = !!input.match(translatableInputsRegex) ? input.match(translatableInputsRegex).length : 0

    const translateFn = translate(startMetric.location, location)
    let idMap = {}
    translatableMetrics.forEach(m => {
      const matchedMetric = metrics.find(m2 => isAtLocation(translateFn(m.location), m2.location))
      if (!!matchedMetric) { idMap[m.readableId] = matchedMetric.readableId }
    })
    const re = RegExp(Object.keys(idMap).join("|"), "g")
    const translatableIds = !!input.match(re) ? input.match(re).length : 0

    if (numInputs !== translatableIds) {
      return {}
    }

    return { metric, guesstimate: {...startGuesstimate, metric: metric.id, input: translateReadableIds(input, idMap)} }
  }
}

function addAtLoc(startMetric, startGuesstimate) {
  return (location, metrics) => {
    const metric = {...startMetric, ...e.metric.create(metrics.map(m => m.readableId)), location}
    return { metric, guesstimate: {...startGuesstimate, metric: metric.id} }
  }
}

function buildNewMetrics(startMetric, startGuesstimate, {direction, length}, metrics) {
  const {guesstimateType, input} = startGuesstimate

  let newMetrics = []
  let newGuesstimates = []

  const isDynamic = guesstimateType === DYNAMIC_FILL_TYPE
  const translateFn = (isDynamic ? fillIntelligent : addAtLoc)(startMetric, startGuesstimate, direction)

  let currLocation = move(startMetric.location, direction)
  for (var i = 0; i < length; i++) {
    const {metric, guesstimate} = translateFn(currLocation, metrics.concat(newMetrics))
    if (!!metric) {newMetrics.push(metric)}
    if (!!guesstimate) {newGuesstimates.push(guesstimate)}
    currLocation = move(currLocation, direction)
  }

  return {newMetrics, newGuesstimates}
}

export function fillRegion(spaceId, {start, end}) {
  return (dispatch, getState) => {
    const state = getState()

    const metrics = state.metrics.filter(m => m.space === spaceId)

    const startMetric = metrics.find(m => isAtLocation(m.location, start))

    const fillRegion = getBounds({start, end})
    const containedMetrics = metrics.filter(m => (m.id !== _.get(startMetric, 'id')) && isWithinRegion(m.location, fillRegion))
    dispatch({ type: 'REMOVE_METRICS', item: {ids: containedMetrics.map(m => m.id)}})
    dispatch(deleteSimulations(containedMetrics.map(m => m.id)))

    if (!startMetric) { return }

    const startGuesstimate = state.guesstimates.find(g => g.metric === startMetric.id)

    const {newMetrics, newGuesstimates} = buildNewMetrics(startMetric, startGuesstimate, getDirAndLen(start, end), metrics)

    dispatch({type: 'ADD_METRICS', items: newMetrics, newGuesstimates: newGuesstimates})
    dispatch(runSimulations({spaceId, onlyUnsimulated: true}))
    dispatch(registerGraphChange(spaceId))
  }
}
