import {addSimulation} from 'gModules/simulations/actions'
import {addSimulationToFact} from 'gModules/facts/actions'

import * as constants from './constants'
import {Simulator} from './simulator'
import {INTERNAL_ERROR, INPUT_ERROR, PARSER_ERROR, INFINITE_LOOP_ERROR} from 'lib/errors/modelErrors'

import e from 'gEngine/engine'

const {
  NODE_TYPES,
  ERROR_SUBTYPES: {GRAPH_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR}},
} = constants

// TODO(matthew): Find a way to test this through the public API.
export function getSubset(state, graphFilters) {
  let spaces = []
  let organization = null

  if (!!graphFilters.factId) {
    const organizationFact = state.facts.organizationFacts.find(({children}) => e.collections.some(children, graphFilters.factId))
    const fact = e.collections.get(_.get(organizationFact, 'children'), graphFilters.factId)
    if (!_.isEmpty(fact.imported_to_intermediate_space_ids)) {
      const orgId = e.organization.organizationIdFromFactReadableId(organizationFact.variable_name)
      organization = e.collections.get(state.organizations, orgId)
      const organizationSpaces = e.collections.filter(state.spaces, orgId, 'organization_id')
      spaces.push(...organizationSpaces.filter(s => s.exported_facts_count > 0 && !_.isEmpty(s.imported_fact_ids)))
    }
  } else if (!!graphFilters.spaceId) {
    spaces.push(e.collections.get(state.spaces, graphFilters.spaceId))
    organization = e.collections.get(state.organizations, _.get(spaces[0], 'organization_id'))
  } else if (!!graphFilters.metricId) {
    const spaceId = e.collections.gget(state.metrics, graphFilters.metricId, 'id', 'space')
    spaces.push(e.collections.get(state.spaces, spaceId))
    organization = e.collections.get(state.organizations, _.get(spaces[0], 'organization_id'))
  }

  spaces.filter(s => !!s)

  if (_.isEmpty(spaces)) { return {subset: {metrics: [], guesstimates: [], simulations: []}, relevantFacts: []} }

  let subset = e.space.subsetFromList(state, spaces)
  const organizationFacts = e.facts.getFactsForOrg(state.facts.organizationFacts, organization)

  const {organizationFactsUsed, globalFactsUsed} = e.facts.getRelevantFactsAndReformatGlobals(subset, state.facts.globalFacts, organizationFacts, spaces.map(s => s.id))

  const globalFactHandleToNodeIdMap = _.transform(
    globalFactsUsed,
    (resultMap, globalFact) => { resultMap[globalFact.variable_name] = e.guesstimate.expressionSyntaxPad(globalFact.id, false) },
    {}
  )

  subset.guesstimates = subset.guesstimates.map(g => ({
    ...g,
    expression: e.utils.replaceByMap(g.expression, globalFactHandleToNodeIdMap)
  }))

  return {subset, relevantFacts: [...organizationFactsUsed, ...globalFactsUsed]}
}

const nodeIdToMetricId = id => id.slice(e.simulation.METRIC_ID_PREFIX.length)
const nodeIdToFactId = id => id.slice(e.simulation.FACT_ID_PREFIX.length)
const nodeIdIsMetric = id => id.includes(e.simulation.METRIC_ID_PREFIX)

function guesstimateTypeToNodeType(guesstimateType) {
  switch (guesstimateType) {
    case 'FUNCTION':
      return NODE_TYPES.FUNCTION
    case 'DATA':
      return NODE_TYPES.DATA
    default:
      return NODE_TYPES.USER_INPUT
  }
}

const filterErrorsFn = e => e.type !== INPUT_ERROR && e.type !== PARSER_ERROR && e.type !== INFINITE_LOOP_ERROR
const metricIdToNodeId = id => `${e.simulation.METRIC_ID_PREFIX}${id}`
const metricToSimulationNodeFn = m => ({
  id: metricIdToNodeId(m.id),
  type: guesstimateTypeToNodeType(m.guesstimate.guesstimateType),
  guesstimateType: m.guesstimate.guesstimateType,
  expression: m.guesstimate.expression,
  samples: m.guesstimate.guesstimateType === 'DATA' ? e.utils.orArr(_.get(m, 'guesstimate.data')) : e.utils.orArr(_.get(m, 'simulation.sample.values')),
  errors: Object.assign([], e.utils.orArr(_.get(m, 'simulation.sample.errors')).filter(filterErrorsFn)),
})

const factIdToNodeId = id => `${e.simulation.FACT_ID_PREFIX}${id}`
const factToSimulationNodeFn = f => ({
  id: factIdToNodeId(f.id),
  expression: f.expression,
  type: NODE_TYPES.UNSET, // Facts are currently type-less.
  guesstimateType: null, // Facts are currently type-less.
  samples: e.utils.orArr(_.get(f, 'simulation.sample.values')),
  errors: [],
  skipSimulating: !_.get(f, 'defining_space_id'),
})

function denormalize({metrics, guesstimates, simulations}) {
  return metrics.map(m => ({
    ...m,
    guesstimate: e.collections.get(guesstimates, m.id, 'metric'),
    simulation: e.collections.get(simulations, m.id, 'metric'),
  }))
}

const allPresent = (obj, ...props) => props.map(p => present(obj, p)).reduce((x,y) => x && y, true)
const present = (obj, prop) => _.has(obj, prop) && (!!_.get(obj, prop) || _.get(obj, prop) === 0)
function translateOptions(graphFilters) {
  if (allPresent(graphFilters, 'factId')) { return {simulateStrictSubsetFrom: [factIdToNodeId(graphFilters.factId)]} }
  if (allPresent(graphFilters, 'metricId', 'onlyHead')) { return {simulateIds: [metricIdToNodeId(graphFilters.metricId)]} }
  if (allPresent(graphFilters, 'metricId', 'notHead')) { return {simulateStrictSubsetFrom: [metricIdToNodeId(graphFilters.metricId)]} }
  if (allPresent(graphFilters, 'simulateSubsetFrom')) { return {simulateSubsetFrom: graphFilters.simulateSubsetFrom.map(metricIdToNodeId)} }
  if (allPresent(graphFilters, 'simulateSubset')) { return {simulateIds: graphFilters.simulateSubset.map(metricIdToNodeId)} }
  return {}
}

function translateErrorFn(denormalizedMetrics, metricID) {
  const metric = e.collections.get(denormalizedMetrics, metricID)
  const getReadableIdFn = id => e.collections.gget(denormalizedMetrics, id, 'id', 'readableId')

  return err => {
    switch (err.subType) {
      case MISSING_INPUT_ERROR:
        return {type: INPUT_ERROR, message: 'Metric depends on deleted metric'}
      case IN_INFINITE_LOOP:
        return {type: INFINITE_LOOP_ERROR, message: 'Metric references itself through dependency chain'}
      case INVALID_ANCESTOR_ERROR:
        let invalidAncestors = Object.assign([], err.ancestors).map(nodeIdToMetricId)
        const invalidDirectInputs = _.remove(invalidAncestors, a => metric.guesstimate.expression.includes(a))

        const invalidAncestorReadableIDs = invalidAncestors.map(getReadableIdFn)
        const invalidDirectInputReadableIDs = invalidDirectInputs.map(getReadableIdFn)
        const hasInvalidInputs = !_.isEmpty(invalidDirectInputReadableIDs)
        const hasInvalidAncestors = !_.isEmpty(invalidAncestorReadableIDs)
        const hasBoth = hasInvalidInputs && hasInvalidAncestors

        let message = 'Broken '
        if (hasInvalidInputs) {
          message += `input${invalidDirectInputs.length > 1 ? 's' : ''} ${invalidDirectInputReadableIDs.join(', ')}`
        }

        if (hasBoth) {
          message += ` and upstream input${invalidAncestors.length > 1 ? 's' : ''} ${invalidAncestorReadableIDs.join(', ')}`
        } else if (hasInvalidAncestors) {
          message += ` upstream input${invalidAncestors.length > 1 ? 's' : ''} ${invalidAncestorReadableIDs.join(', ')}`
        }
        message += '.'


        return {type: INPUT_ERROR, message}
      default:
        return err
    }
  }
}

export function simulate(dispatch, getState, graphFilters) {
  const state = getState()

  const {subset, relevantFacts} = getSubset(state, graphFilters)
  const denormalizedMetrics = denormalize(subset)

  const nodes = [...denormalizedMetrics.map(metricToSimulationNodeFn), ...relevantFacts.map(factToSimulationNodeFn)]

  if (_.isEmpty(nodes)) { return }

  const propagationId = (new Date()).getTime()

  const getCurrPropId = nodeId => {
    if (nodeIdIsMetric(nodeId)) {
      return e.collections.gget(state.simulations, nodeIdToMetricId(nodeId), 'metric', 'propagationId')
    } else {
      return 0 // TODO(matthew): Fix this.
    }
  }
  const yieldMetricSims = (nodeId, {samples, errors}) => {
    const metric = nodeIdToMetricId(nodeId)
    const newSimulation = {
      metric,
      propagationId,
      sample: {
        values: _.isEmpty(errors) ? samples : [],
        errors: errors.map(translateErrorFn(denormalizedMetrics, metric))
      }
    }
    dispatch(addSimulation(newSimulation))
  }

  const yieldFactSims = (nodeId, {samples, errors}) => {
    const factId = nodeIdToFactId(nodeId)
    const newSimulation = {
      sample: {
        values: _.isEmpty(errors) ? samples : [],
        errors: errors
      }
    }
    dispatch(addSimulationToFact(newSimulation, factId))
  }

  const yieldSims = (nodeId, sim) => { nodeIdIsMetric(nodeId) ? yieldMetricSims(nodeId, sim) : yieldFactSims(nodeId, sim) }

  let simulator = new Simulator(nodes, e.simulation.NUM_SAMPLES, translateOptions(graphFilters), propagationId, yieldSims, getCurrPropId)
  simulator.run()
}
