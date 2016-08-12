import * as _graph from './graph'
import * as _dGraph from './dgraph'
import * as _metric from './metric'
import * as _guesstimate from './guesstimate'
import * as _simulation from './simulation'
import * as _userOrganizationMemberships from './userOrganizationMemberships'
import * as _facts from './facts'
import * as _collections from './collections'

export const url = ({id}) => (!!id) ? `/models/${id}` : ''
export const withGraph = (space, graph) => ({...space, graph: subset(graph, space.id)})

export function subset(graph, spaceId) {
  if (!spaceId) { return graph }

  const metrics = _collections.filter(graph.metrics, spaceId, 'space')
  const guesstimates = metrics.map(_guesstimate.getByMetricFn(graph)).filter(_collections.isPresent)
  const simulations = guesstimates.map(_simulation.getByMetricFn(graph)).filter(_collections.isPresent)
  return { metrics, guesstimates, simulations }
}

export function expressionsToInputs(graph, facts) {
  const expressionToInputFn = _guesstimate.expressionToInputFn(graph.metrics, facts)
  return {...graph, guesstimates: graph.guesstimates.map(expressionToInputFn)}
}

export function possibleFacts({organization_id}, {organizations}, organizationFacts) {
  const org = _collections.get(organizations, organization_id)
  return !!org ? _facts.getFactsForOrg(organizationFacts, org) : []
}

export function toDSpace(spaceId, graph, organizationFacts) {
  let space = _collections.get(graph.spaces, spaceId)
  if (!space) { return {} }

  let dSpace = {...space, ...toDgraph(space.id, graph)}

  const facts = possibleFacts(dSpace, graph, organizationFacts)
  const withInputFn = _guesstimate.expressionToInputFn(dSpace.metrics, facts)

  dSpace.metrics = dSpace.metrics.map(m => ({...m, guesstimate: withInputFn(m.guesstimate)}))

  dSpace.edges = _dGraph.dependencyMap(dSpace)
  dSpace.metrics = dSpace.metrics.map(s => {
    let edges = {}
    edges.inputs = dSpace.edges.filter(i => i.output === s.id).map(e => e.input)
    edges.outputs = dSpace.edges.filter(i => i.input === s.id).map(e => e.output)
    edges.inputMetrics = edges.inputs.map(i => dSpace.metrics.find(m => m.id === i))
    return { ...s, edges }
  })

  return dSpace
}

export function toDgraph(spaceId, graph){
  const space = _collections.get(graph.spaces, spaceId)
  const {users, organizations, calculators, userOrganizationMemberships, me} = graph
  const {user_id, organization_id} = space

  return {
    ..._graph.denormalize(graph, spaceId),
    user: _collections.get(users, user_id),
    organization: _collections.get(organizations, organization_id),
    calculators: _collections.filter(calculators, spaceId, 'space_id'),
    editableByMe: canEdit(space, me, userOrganizationMemberships),
  }
}

export function canEdit(space, me, userOrganizationMemberships, canvasState) {
  if (_.has(canvasState, 'editsAllowed') && !canvasState.editsAllowed) { return false }

  const meId = _.get(me, 'id')
  if (!!space.organization_id) {
    return _userOrganizationMemberships.isMember(space.organization_id, meId, userOrganizationMemberships)
  } else {
    return space.user_id === meId
  }
}
