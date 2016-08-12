import * as metricActions from 'gModules/metrics/actions'
import {runSimulations, deleteSimulations} from 'gModules/simulations/actions'
import {registerGraphChange} from 'gModules/spaces/actions'

import e from 'gEngine/engine'

import {isAtLocation, isWithinRegion, getBounds, move, translate} from 'lib/locationUtils'

const DYNAMIC_FILL_TYPE = 'FUNCTION'

// TODO(matthew): Dry up code with this and copy and undo.

function getDirAndLen(start, end) {
  return {
    direction: {row: Math.sign(end.row - start.row), column: Math.sign(end.column - start.column)},
    length: Math.abs(start.row - end.row) || Math.abs(start.column - end.column),
  }
}

function buildNewMetric(startMetric, metrics, location) {
  const metricId = metrics.find(m => isAtLocation(m.location, location)) || e.metric.create(metrics.map(m => m.readableId))
  return {...startMetric, ..._.pick(metricId, ['id', 'readableId']), location}
}

function isNonConstant({location, name}, direction, metrics) {
  return _.some(metrics, m => isAtLocation(move(location, direction), m.location)) || _.isEmpty(name)
}

// TODO(matthew): Make this not exported (Test through the public API)
export function fillDynamic(startMetric, startGuesstimate, direction) {
  const {expression} = startGuesstimate
  return (location, metrics) => {
    const metric = buildNewMetric(startMetric, metrics, location)

    const nonConstantMetrics = metrics.filter(m => isNonConstant(m, direction, metrics))
    if (_.isEmpty(nonConstantMetrics)) { return {metric, guesstimate: {...startGuesstimate, metric: metric.id}} }

    const nonConstantInputsRegex = e.utils.or(nonConstantMetrics.map(e.guesstimate.expressionSyntaxPad))
    const numNonConstantInputs = (expression.match(nonConstantInputsRegex) || []).length

    const translateFn = translate(startMetric.location, location)
    let idMap = {}
    nonConstantMetrics.forEach(m => {
      const matchedMetric = metrics.find(m2 => isAtLocation(translateFn(m.location), m2.location))
      if (!!matchedMetric) {
        idMap[e.guesstimate.expressionSyntaxPad(m.id, true)] = e.guesstimate.expressionSyntaxPad(matchedMetric.id, true)
      }
    })
    if (_.isEmpty(idMap)) {
      if (numNonConstantInputs === 0) { return {metric, guesstimate: {...startGuesstimate, metric: metric.id}} }
      else { return {} }
    }

    const translatableInputsRegex = e.utils.or(Object.keys(idMap))
    const numTranslatedInputs = numNonConstantInputs === 0 ? 0 : (expression.match(translatableInputsRegex) || []).length

    if (numNonConstantInputs !== numTranslatedInputs) { return {} }

    return { metric, guesstimate: {...startGuesstimate, metric: metric.id, expression: e.utils.replaceByMap(expression, idMap) } }
  }
}

function fillStatic(startMetric, startGuesstimate) {
  return (location, metrics) => {
    const metric = buildNewMetric(startMetric, metrics, location)
    return { metric, guesstimate: {...startGuesstimate, metric: metric.id} }
  }
}

function buildNewMetrics(startMetric, startGuesstimate, {direction, length}, metrics) {
  const {guesstimateType, input} = startGuesstimate

  let newMetrics = []
  let newGuesstimates = []

  const isDynamic = guesstimateType === DYNAMIC_FILL_TYPE
  const translateFn = (isDynamic ? fillDynamic : fillStatic)(startMetric, startGuesstimate, direction)

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
