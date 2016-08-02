import {PropTypes} from 'react'

import generateRandomReadableId from './metric/generate_random_readable_id'
import * as _guesstimate from './guesstimate'

import MetricPropagation from 'lib/propagation/metric-propagation'
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

export const HANDLE_REGEX = /(?:@\w+(?:\.\w+)?|#\w+)/g

export const getVar = f => _.get(f, 'variable_name')
const byVariableName = name => f => getVar(f) === name
const namedLike = partial => f => getVar(f).startsWith(partial)

export function withSortedValues(rawFact) {
  let fact = Object.assign({}, rawFact)
  _.set(fact, 'simulation.sample.sortedValues', sortDescending(_.get(fact, 'simulation.sample.values')))
  return fact
}

export function selectorSearch(selector, facts) {
  const partial = selector.pop()
  const possibleFacts = _.isEmpty(selector) ? facts : findBySelector(facts, selector).children
  if (_.isEmpty(partial) || !possibleFacts) { return {partial, suggestion: ''} }
  else { return {partial, suggestion: getVar(possibleFacts.find(namedLike(partial))) || ''} }
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
const toGuesstimate = (selector, {expression}) => ({metric: idFrom(selector), input: expression})
const toSimulation = (selector, {values}) => ({metric: idFrom(selector), sample: {values}})

const buildFullNode = (selector, fact, takenReadableIds) => ({
  metric: toMetric(selector, takenReadableIds),
  guesstimate: toGuesstimate(selector, fact),
  simulation: toSimulation(selector, fact),
})

const globalSelector = handle => handle.slice(1).split('.')
const orgSelector = (orgId, handle) => [`organization_${orgId}`,handle.slice(1)]
export const resolveToSelector = orgId => handle => handle.startsWith('#') ? orgSelector(orgId, handle) : globalSelector(handle)

export function addFactsToSpaceGraph({metrics, guesstimates, simulations}, {globalFacts, organizationFacts}, {organization_id}) {
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
  let [factMetrics, factGuesstimates, factSimulations, factHandleMap] = [[], [], [], {}]
  grouped.forEach(([handle, selector, fact]) => {
    // We construct virtual metrics, guesstimates, and simulations from the selector, fact, and running readable IDs...
    const {metric, guesstimate, simulation} = buildFullNode(selector, fact, readableIds)

    // Then update all the running variables.
    factHandleMap[handle] = metric.readableId
    readableIds = [...readableIds, metric.readableId]
    factMetrics = [...factMetrics, metric]
    factGuesstimates = [...factGuesstimates, guesstimate]
    factSimulations = [...factSimulations, simulation]
  })

  return {
    metrics: [...metrics, ...factMetrics],
    guesstimates: [...guesstimates.map(_guesstimate.translateFactHandleFn(factHandleMap)), ...factGuesstimates],
    simulations: [...simulations, ...factSimulations],
  }
}

export function simulateFact(fact) {
  const fakeSelector = ['fact']
  const guesstimate = toGuesstimate(fakeSelector, fact)
  const graph = {metrics: [{id: guesstimate.metric}], guesstimates: [guesstimate]}
  const metricPropagation = new MetricPropagation(guesstimate.metric, [], 0)

  return metricPropagation.simulate(metricPropagation.remainingSimulations[0], graph).then(
    ({sample: {values, errors}}) => ({values, errors})
  )
}

const readableIdPartFromWord = word => (/\d/).test(word) ? word : word[0]
export function getBaseVariableName(rawName) {
  const name = rawName.trim().replace(/[^\w\d]/g, ' ').toLowerCase()
  const words = name.split(/[^\w\d]/).filter(s => !_.isEmpty(s))
  if (words.length === 1 && name.length < 10) {
    return name
  } else if (words.length < 3) {
    return name.slice(0,3)
  } else {
    return words.map(readableIdPartFromWord).join('')
  }
}

export function getVariableNameFromName(rawName, otherVariableNames) {
  const baseVariableName = getBaseVariableName(rawName)
  const inclusionRE = new RegExp(`^${baseVariableName}(?:_(\\d+))?$`)
  const matchedNames = otherVariableNames.filter(v => inclusionRE.test(v))
  if (_.isEmpty(matchedNames)) { return baseVariableName }

  const matchedNumerals = matchedNames.map(v => v.match(inclusionRE)[1]).map(n => _.isEmpty(n) ? 0 : parseFloat(n))
  return `${baseVariableName}_${Math.max(...matchedNumerals) + 1}`
}
