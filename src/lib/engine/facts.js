import {PropTypes} from 'react'

import generateRandomReadableId from './metric/generate_random_readable_id'
import * as _guesstimate from './guesstimate'
import * as _organization from './organization'
import * as _collections from './collections'
import * as _utils from './utils'
import {NUM_SAMPLES} from './simulation'

import {Guesstimator} from 'lib/guesstimator/index'
import {_matchingFormatter} from 'lib/guesstimator/formatter/index'
import {sortDescending} from 'lib/dataAnalysis'

export const FactPT = PropTypes.shape({
  name: PropTypes.string.isRequired,
  variable_name: PropTypes.string.isRequired,
  expression: PropTypes.string,
  exported_from_id: PropTypes.number,
  metric_id: PropTypes.string,
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

export const getVar = f => _utils.orStr(_.get(f, 'variable_name'))
export const byVariableName = name => f => getVar(f) === name
const namedLike = partial => f => getVar(f).startsWith(partial)

export const isExportedFromSpace = f => _utils.allPropsPresent(f, 'exported_from_id')

export const length = f => _.get(f, 'simulation.sample.values.length')
export const mean = f => _.get(f, 'simulation.stats.mean')
export const adjustedConfidenceInterval = f => _.get(f, 'simulation.stats.adjustedConfidenceInterval')

export function hasRequiredProperties(f) {
  let requiredProperties = ['variable_name', 'name']
  if (!isExportedFromSpace(f)) { requiredProperties.push('expression', 'simulation.sample.values', 'simulation.stats') }

  return _utils.allPresent(requiredProperties.map(prop => _.get(f, prop)))
}

export function withMissingStats(rawFact) {
  let fact = _utils.mutableCopy(rawFact)
  _.set(fact, 'simulation.sample.sortedValues', sortDescending(_.get(fact, 'simulation.sample.values')))

  const length = _.get(fact, 'simulation.stats.length')
  const needsACI = _.isFinite(length) && length > 1
  const ACIlength = _.get('simulation.stats.adjustedConfidenceInterval.length')
  const hasACI = _.isFinite(ACIlength) && ACIlength === 2
  if (needsACI && !hasACI) { _.set(fact, 'simulation.stats.adjustedConfidenceInterval', [null, null]) }

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

export const getFactsForOrg = (facts, org) => !org ? [] : _utils.orArr(
  _collections.gget(facts, _organization.organizationReadableId(org), 'variable_name', 'children')
)

export function getRelevantFactsAndReformatGlobals({metrics, guesstimates, simulations}, globalFacts, organizationFacts, spaceIds) {
  const rawOrganizationFactsDefined = _collections.filterByInclusion(organizationFacts, 'exported_from_id', spaceIds)
  const organizationFactsDefined = rawOrganizationFactsDefined.map(f => ({
    ...f,
    expression: `=${_guesstimate.expressionSyntaxPad(f.metric_id)}`
  }))

  const organizationFactsUsed = organizationFacts.filter(
    f => _.some(guesstimates, g => _utils.orStr(g.expression).includes(_guesstimate.expressionSyntaxPad(f.id, false)))
  )
  const organizationFactsUsedDeDuped = organizationFactsUsed.filter(f => !_collections.some(organizationFactsDefined, f.id))

  // First we grab the top level global facts (e.g. the fact for 'Chicago') which contain as children subfacts of the
  // population variety. We'll next pre-resolve these into 'fake facts' momentarily.
  const globalFactContainersUsed = globalFacts.filter(f => _.some(guesstimates, g => _utils.orStr(g.expression).includes(f.variable_name)))
  const globalFactsUsed = globalFactContainersUsed.map(f => ({
    ...f.children[0],
    id: `${f.variable_name}.population`,
    variable_name: `@${f.variable_name}.population`,
  }))

  return {organizationFactsUsed: [...organizationFactsUsedDeDuped, ...organizationFactsDefined], globalFactsUsed}
}

export function simulateFact(fact) {
  const guesstimatorInput = { text: fact.expression, guesstimateType: null }
  const formatter = _matchingFormatter(guesstimatorInput)
  const guesstimator = new Guesstimator({parsedError: formatter.error(guesstimatorInput), parsedInput: formatter.format(guesstimatorInput)})
  return guesstimator.sample(NUM_SAMPLES, {})
}
