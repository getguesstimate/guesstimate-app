import {addSimulation} from 'gModules/simulations/actions'

import {NODE_TYPES} from './constants'
import {Simulator} from './simulator'

import e from 'gEngine/engine'

// simulation {
//   sample {
//     values: [...],
//     errors: [...],
//   }
//   stats {
//   }
// }

function spaceSubset(state, spaceId) {
  const space = e.collections.get(state.spaces, spaceId)
  const organization = e.collections.get(state.organizations, _.get(space, 'organization_id'))

  const spaceSubset = e.space.subset(state, spaceId, true)
  const organizationalFacts = e.facts.getFactsForOrg(state.facts.organizationFacts, organization)
  const translatedSubset = e.space.expressionsToInputs(spaceSubset, organizationalFacts)

  return e.facts.addFactsToSpaceGraph(translatedSubset, state.facts.globalFacts, state.facts.organizationFacts, space)
}

const nodeIdToMetricId = id => id.slice(7)
const metricIdToNodeId = id => `metric:${id}`
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
const metricToSimulationNodeFn = m => ({
  id: metricIdToNodeId(m.id),
  type: guesstimateTypeToNodeType(m.guesstimate.guesstimateType),
  expression: m.guesstimate.expression,
  samples: m.guesstimate.guesstimateType === 'DATA' ? e.utils.orArr(_.get(m, 'guesstimate.data')) : e.utils.orArr(_.get(m, 'simulation.sample.values')),
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
function translateOptions(graphFilters, denormalizedMetrics) {
  if (allPresent(graphFilters, 'metricId', 'onlyHead')) { return {simulateIds: [metricIdToNodeId(graphFilters.metricId)]} }
  if (allPresent(graphFilters, 'metricId', 'notHead')) { return {simulateStrictSubsetFrom: [metricIdToNodeId(graphFilters.metricId)]} }
  if (allPresent(graphFilters, 'simulateSubsetFrom')) { return {simulateSubsetFrom: graphFilters.simulateSubsetFrom.map(metricIdToNodeId)} }
  if (allPresent(graphFilters, 'simulateSubset')) { return {simulateIds: graphFilters.simulateSubset.map(metricIdToNodeId)} }
  return {}
}

export function simulate(dispatch, getState, graphFilters) {
  let spaceId = graphFilters.spaceId
  if (spaceId === undefined && graphFilters.metricId) {
    const metric = e.collections.get(getState().metrics, graphFilters.metricId)
    if (!!metric) { spaceId = metric.space }
  }
  if (!spaceId) { return }

  const subset = spaceSubset(getState(), spaceId)
  const denormalizedMetrics = denormalize(subset)
  const nodes = denormalizedMetrics.map(metricToSimulationNodeFn)

  const propagationId = (new Date()).getTime()

  const getCurrPropId = nodeId => e.collections.gget(getState().simulations, nodeIdToMetricId(nodeId), 'metric', 'propagationId')
  const yieldSims = (nodeId, sim) => {
    const {samples, errors} = sim
    const metric = nodeIdToMetricId(nodeId)
    const newSimulation = {metric, propagationId, sample: {values: samples, errors}}
    dispatch(addSimulation(newSimulation))
  }

  let simulator = new Simulator(nodes, 5000, translateOptions(graphFilters, denormalizedMetrics), propagationId, yieldSims, getCurrPropId)
  simulator.run()
}
