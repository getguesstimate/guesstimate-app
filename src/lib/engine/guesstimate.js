/* @flow */

import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types'
import {Guesstimator} from '../guesstimator/index'
import {INPUT_ERROR} from 'lib/errors/modelErrors'
import {HANDLE_REGEX} from './facts'
import * as _collections from './collections'
import * as _utils from './utils'

export function equals(l, r) {
  return (
    l.description === r.description &&
    l.guesstimateType === r.guesstimateType &&
    l.expression === r.expression
  )
}

export const getByMetricFn = graph => _collections.getFn(_.get(graph, 'guesstimates'), 'metric')

export const attributes = ['metric', 'expression', 'input', 'guesstimateType', 'description', 'data']

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1) {
  const metric = guesstimate.metric

  let errors = []
  const [parseError, item] = Guesstimator.parse(guesstimate)
  if (!_.isEmpty(parseError)) {errors.push(parseError)}

  const [inputs, inputErrors] = item.needsExternalInputs() ? _inputMetricsWithValues(guesstimate, dGraph) : [{}, []]
  errors.push(...inputErrors)

  if (!_.isEmpty(errors)) {
    return Promise.resolve({ metric, sample: {values: [], errors} })
  }

  return item.sample(n, inputs).then(sample => ({ metric, sample }))
}

export function format(guesstimate: Guesstimate): Guesstimate {
  let formatted = _.pick(guesstimate, attributes)
  return formatted
}

export const extractFactHandles = ({input}) => _.isEmpty(input) ? [] : input.match(HANDLE_REGEX)

const padNonAlphaNumeric = str => `(?:[^\\w]|^)(${str})(?:[^\\w]|$)`

export function translateFactHandleFn(handleMap) {
  return g => _.isEmpty(handleMap) ? g : {...g, input: _utils.replaceByMap(g.input, handleMap)}
}

export function update(oldGuesstimate, newParams) {
  let newGuesstimate = Object.assign({}, oldGuesstimate, newParams)
  newGuesstimate.guesstimateType = newGuesstimateType(newGuesstimate)
  return format(newGuesstimate)
}

export function newGuesstimateType(newGuesstimate) {
  const [errors, item] = Guesstimator.parse(newGuesstimate)
  return item.samplerType().referenceName
}

const isInputOf = (guesstimate) => ({readableId}) => _utils.orStr(_.get(guesstimate, 'input')).includes(readableId)
export const inputMetrics = (guesstimate, {metrics}) => _utils.orArr(metrics).filter(isInputOf(guesstimate))

function _inputMetricsWithValues(guesstimate: Guesstimate, dGraph: DGraph): Object{
  let inputs = {}
  let errors = []
  inputMetrics(guesstimate, dGraph).map(m => {
    inputs[m.readableId] = _.get(m, 'simulation.sample.values')

    const inputErrors = _.get(m, 'simulation.sample.errors') || []
    if (_.isEmpty(inputs[m.readableId]) && _.isEmpty(inputErrors)) {
      errors.push({type: INPUT_ERROR, message: `Empty input ${m.readableId}`})
    }

    errors.push(...inputErrors.map(
      ({type, message}) => {
        if (type === INPUT_ERROR) {
          return {
            type,
            message: message.includes('upstream') ? message : message.replace('input', 'upstream input')
          }
        }
        return {type: INPUT_ERROR, message: `Broken input ${m.readableId}`}
      }
    ))
  })
  return [inputs, _.uniq(errors)]
}

// In the `expression` syntax, input metrics are expressed as `${metric:[metric id]}`. To match that in a regex, and
// translate to it, we need functions that wrap passed IDs in the right syntax, appropriately escaped.
export const expressionSyntaxPad = (id, isMetric=true) => `\$\{${isMetric ? 'metric' : 'fact'}:${id}\}`

// Returns a function which takes a guesstimate and returns that guesstimate with an input based on its
// expression.
export function expressionToInputFn(metrics=[], facts=[]) {
  let idMap = {}, reParts = []
  metrics.forEach( ({id, readableId}) => {idMap[expressionSyntaxPad(id, true)] = readableId} )
  facts.forEach( ({id, variable_name}) => {idMap[expressionSyntaxPad(id, false)] = `#${variable_name}`} )

  const translateValidInputsFn = expression => _utils.replaceByMap(expression, idMap)
  const translateRemainingInputsFn = expression => expression.replace(/\$\{.*\}/, '??')

  const translateInputsFn = ({expression}) => translateRemainingInputsFn(translateValidInputsFn(expression))

  return g => (!_.isEmpty(g.input) || _.isEmpty(g.expression)) ? g : {...g, input: translateInputsFn(g)}
}

// Returns an expression based on the passed input and idMap.
export function inputToExpression(input, idMap) {
  const replaceMap = _.transform(idMap, (result, value, key) => {result[key] = expressionSyntaxPad(value.id, value.isMetric)})
  return _utils.replaceByMap(input, replaceMap)
}
