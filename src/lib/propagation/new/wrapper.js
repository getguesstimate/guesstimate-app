import {addSimulation} from 'gModules/simulations/actions'

import {NODE_TYPES} from './constants'
import {Simulator} from './simulator'

import e from 'gEngine/engine'

function isRecentPropagation(propagationId: number, simulation: Simulation) {
  return !_.has(simulation, 'propagation') || (propagationId >= simulation.propagation)
}

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
  errors: e.utils.orArr(_.get(m, 'simulation.sample.errors')),
})

function buildSimulationNodes({metrics, guesstimates, simulations}) {
  const denormalizedMetrics = metrics.map(m => ({
    ...m,
    guesstimate: e.collections.get(guesstimates, m.id, 'metric'),
    simulation: e.collections.get(simulations, m.id, 'metric'),
  }))
  return denormalizedMetrics.map(metricToSimulationNodeFn)
}
// TODO(matthew): Wrong, needs to actually not include metricId in not subset.
function translateOptions(graphFilters) {
  return {
    simulteId: _.has(graphFilters, 'metricId') && _.has(graphFilters, 'onlyHead') ? metricIdToNodeId(graphFilters.metricId) : null,
    simulateSubset: _.has(graphFilters, 'metricId') && _.has(graphFilters, 'notHead') ? [metricIdToNodeId(graphFilters.metricId)] : null,
  }
}

export function simulate(dispatch, getState, graphFilters) {
  let spaceId = graphFilters.spaceId
  if (spaceId === undefined && graphFilters.metricId) {
    const metric = e.collections.get(getState().metrics, graphFilters.metricId)
    if (!!metric) { spaceId = metric.space }
  }
  if (!spaceId) { return }

  const subset = spaceSubset(getState(), spaceId)
  const nodes = buildSimulationNodes(subset)

  const currPropId = 1 // TODO(set this properly)
  const propagation = !!currPropId ? 1 : currPropId + 1

  const getCurrPropId = nodeId => e.collections.gget(getState().simulations, nodeIdToMetricId(nodeId), 'metric', 'propagation')
  const yieldSims = (nodeId, sim) => {
    const {samples, errors} = sim
    const metric = nodeIdToMetricId(nodeId)
    const newSimulation = {metric, propagation, sample: {values: samples, errors}}
    dispatch(addSimulation(newSimulation))
  }

  let simulator = new Simulator(nodes, 5000, translateOptions(graphFilters), propagation, yieldSims, getCurrPropId)
  simulator.run()
}
