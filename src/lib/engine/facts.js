import {PropTypes} from 'react'

import generateRandomReadableId from './metric/generate_random_readable_id'
import * as _guesstimate from './guesstimate'
import * as _organization from './organization'

import {Guesstimator} from 'lib/guesstimator/index'
import {_matchingFormatter} from 'lib/guesstimator/formatter/index'
import {sortDescending} from 'lib/dataAnalysis'

export const FactPT = PropTypes.shape({
  name: PropTypes.string.isRequired,
  variable_name: PropTypes.string.isRequired,
  expression: PropTypes.string.isRequired,
  simulation: PropTypes.shape({
    sample: PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.number).isRequired,
      errors: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    stats: PropTypes.shape({
      adjustedConfidenceInterval: PropTypes.arrayOf(PropTypes.number),
      mean: PropTypes.number,
      stdev: PropTypes.number,
      length: PropTypes.number,
      percentiles: PropTypes.shape({
        5: PropTypes.number.isRequired,
        50: PropTypes.number.isRequired,
        95: PropTypes.number.isRequired,
      })
    }),
  }).isRequired,
})

export const GLOBALS_ONLY_REGEX = /@\w+(?:\.\w+)?/g
export const HANDLE_REGEX = /(?:@\w+(?:\.\w+)?|#\w+)/g

export const getVar = f => _.get(f, 'variable_name') || ''
export const byVariableName = name => f => getVar(f) === name
const namedLike = partial => f => getVar(f).startsWith(partial)

export function withSortedValues(rawFact) {
  let fact = Object.assign({}, rawFact)
  _.set(fact, 'simulation.sample.sortedValues', sortDescending(_.get(fact, 'simulation.sample.values')))
  return fact
}

export function selectorSearch(selector, facts) {
  const partial = selector.pop()
  const possibleFacts = _.isEmpty(selector) ? facts : findBySelector(facts, selector).children
  if (_.isEmpty(partial) || _.isEmpty(possibleFacts)) { return {partial, suggestion: ''} }

  const matches = possibleFacts.filter(namedLike(partial))
  if (_.isEmpty(matches)) { return {partial, suggestion: ''} }

  const suggestion = getVar(matches[0])
  return {partial, suggestion}
}

function findBySelector(facts, selector, currFact = {}) {
  if (_.isEmpty(selector)) { return currFact }
  if (_.isEmpty(facts)) { return {} }
  const fact = facts.find(byVariableName(selector[0]))
  if (!fact) { return {} }
  return findBySelector(fact.children, selector.slice(1), fact)
}

const idFrom = selector => selector.join('.')
const toMetric = (selector, takenReadableIds) => ({id: idFrom(selector), readableId: generateRandomReadableId(takenReadableIds)})
const toGuesstimate = (selector, {expression}) => ({metric: idFrom(selector), input: expression, expression})
const toSimulation = (selector, {simulation}) => ({...simulation, metric: idFrom(selector)})

const buildFullNode = (selector, fact, takenReadableIds) => ({
  metric: toMetric(selector, takenReadableIds),
  guesstimate: toGuesstimate(selector, fact),
  simulation: toSimulation(selector, fact),
})

const globalSelector = handle => handle.slice(1).split('.')
const orgSelector = (orgId, handle) => [`organization_${orgId}`,handle.slice(1)]
export const resolveToSelector = orgId => handle => handle.startsWith('#') ? orgSelector(orgId, handle) : globalSelector(handle)

const forOrg = org => byVariableName(_organization.organizationReadableId(org))
export const getFactsForOrg = (facts, org) => (!org || _.isEmpty(facts)) ? [] : _.get(facts.find(forOrg(org)), 'children') || []

export function addFactsToSpaceGraph({metrics, guesstimates, simulations}, globalFacts, organizationFacts, {organization_id}) {
  const possibleFacts = [...globalFacts, organizationFacts.find(f => f.variable_name === `organization_${organization_id}`)]

  // First we need to extract out the relevant fact handles, which we'll evaluate into full selectors, and the facts to
  // which they refer from the graph. We group them as they are used as a unit later.
  const handles = _.uniq(_.flatten(guesstimates.map(_guesstimate.extractFactHandles))).filter(h => !_.isEmpty(h))
  const selectors = handles.map(resolveToSelector(organization_id))
  const facts = selectors.map(s => findBySelector(possibleFacts, s))
  const grouped = _.zip(handles, selectors, facts).filter(([_1, _2, f]) => _.has(f, 'variable_name'))

  // When dynamically generating new metrics, we need non-colliding readableIds, so we'll store a running copy of those
  // used, and initialize some variables to account for the extra objects we'll build.
  let readableIds = metrics.map(m => m.readableId)
  let [factMetrics, factGuesstimates, factSimulations, factIdMap] = [[], [], [], {}]
  grouped.forEach(([handle, selector, fact]) => {
    // We construct virtual metrics, guesstimates, and simulations from the selector, fact, and running readable IDs...
    const {metric, guesstimate, simulation} = buildFullNode(selector, fact, readableIds)

    // Then update all the running variables.
    const idToTranslate = !!_.get(fact, 'id') ? `\$\{fact:${fact.id}\}` : handle
    factIdMap[idToTranslate] = `\$\{metric:${metric.id}\}`

    readableIds = [...readableIds, metric.readableId]

    factMetrics = [...factMetrics, metric]
    factGuesstimates = [...factGuesstimates, guesstimate]
    factSimulations = [...factSimulations, simulation]
  })

  return {
    metrics: [...metrics, ...factMetrics],
    guesstimates: [...guesstimates.map(_guesstimate.translateFactHandleFn(factIdMap)), ...factGuesstimates],
    simulations: [...simulations, ...factSimulations],
  }
}

export function simulateFact(fact, numSamples=5000) {
  const e = { text: fact.expression, guesstimateType: null }
  const formatter = _matchingFormatter(e)
  const gtr = new Guesstimator({parsedError: formatter.error(e), parsedInput: formatter.format(e)})
  return gtr.sample(numSamples, {})
}
