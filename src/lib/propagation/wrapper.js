import {addSimulation} from 'gModules/simulations/actions'

import * as constants from './constants'
import {Simulator} from './simulator'
import {INTERNAL_ERROR, INPUT_ERROR, PARSER_ERROR, INFINITE_LOOP_ERROR} from 'lib/errors/modelErrors'

import e from 'gEngine/engine'

const {
  NODE_TYPES,
  ERROR_SUBTYPES: {GRAPH_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR}},
} = constants

function spaceSubset(state, spaceId) {
  const space = e.collections.get(state.spaces, spaceId)
  const organization = e.collections.get(state.organizations, _.get(space, 'organization_id'))

  let subset = e.space.subset(state, spaceId, true)
  const organizationFacts = e.facts.getFactsForOrg(state.facts.organizationFacts, organization)

  const {organizationFactsUsed, globalFactsUsed} = e.facts.getRelevantFactsAndReformatGlobals(subset, state.facts.globalFacts, organizationFacts)

  const globalFactHandleToNodeIdMap = _.transform(
    globalFactsUsed,
    (resultMap, globalFact) => { resultMap[globalFact.variable_name] = e.guesstimate.expressionSyntaxPad(globalFact.id, false) },
    {}
  )

  subset.guesstimates = subset.guesstimates.map(g => ({
    ...g,
    expression: e.utils.replaceByMap(g.expression, globalFactHandleToNodeIdMap)
  }))

  console.log([subset.guesstimates, organizationFactsUsed, globalFactsUsed, globalFactHandleToNodeIdMap])

  return {subset, relevantFacts: [...organizationFactsUsed, ...globalFactsUsed]}
}

const nodeIdToMetricId = id => id.slice(7)

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
  let spaceId = graphFilters.spaceId
  if (spaceId === undefined && graphFilters.metricId) {
    const metric = e.collections.get(getState().metrics, graphFilters.metricId)
    if (!!metric) { spaceId = metric.space }
  }
  if (!spaceId) { return }

  const {subset, relevantFacts} = spaceSubset(getState(), spaceId)
  const denormalizedMetrics = denormalize(subset)

  const nodes = [...denormalizedMetrics.map(metricToSimulationNodeFn), ...relevantFacts.map(factToSimulationNodeFn)]

  const propagationId = (new Date()).getTime()

  const getCurrPropId = nodeId => e.collections.gget(getState().simulations, nodeIdToMetricId(nodeId), 'metric', 'propagationId')
  const yieldSims = (nodeId, sim) => {
    const {samples, errors} = sim
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

  let simulator = new Simulator(nodes, e.simulation.NUM_SAMPLES, translateOptions(graphFilters), propagationId, yieldSims, getCurrPropId)
  simulator.run()
}
