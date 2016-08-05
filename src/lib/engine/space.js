import * as _graph from './graph'
import * as _dGraph from './dgraph'
import * as _metric from './metric'
import * as _guesstimate from './guesstimate'
import * as _userOrganizationMemberships from './userOrganizationMemberships'
import * as _facts from './facts'

export function url (space) {
  return (!!space) ? ('/models/' + space.id) : ''
}

export function get(collection, id){
  return collection.find(i => (i.id === id))
}

export function subset(graph, spaceId){
  if (spaceId){
    const metrics = graph.metrics.filter(m => m.space === spaceId)
    const guesstimates = _.flatten(metrics.map(m => _metric.guesstimates(m, graph)))
    const simulations = _.flatten(guesstimates.map(g => _guesstimate.simulations(g, graph)))
    return { metrics, guesstimates, simulations }
  } else {
    return graph
  }
}

export function expressionsToInputs(graph, facts) {
  const expressionToInputFn = _guesstimate.expressionToInputFn(graph.metrics, facts)
  return {...graph, guesstimates: graph.guesstimates.map(expressionToInputFn)}
}

export const withGraph = (space, graph) => ({...space, graph: subset(graph, space.id)})

const sameIds = (u1, u2) => u1 && u2 && (u1.toString() === u2.toString())
const user = (space, graph) => graph.users.find(e => sameIds(e.id, space.user_id))
const organization = (space, graph) => (graph.organizations || []).find(e => sameIds(e.id, space.organization_id))

export function possibleFacts(space, graph, organizationFacts) {
  const org = organization(space, graph)
  return !!org ? _facts.getFactsForOrg(organizationFacts, org) : []
}

export function toDSpace(spaceId, graph, organizationFacts) {
  let space = graph.spaces && graph.spaces.find(s => sameIds(s.id, spaceId))
  if (!space) { return {} }

  let dSpace = Object.assign(space.asMutable(), toDgraph(space.id, graph))

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
  let dGraph = _graph.denormalize(subset(graph, spaceId))
  const space = get(graph.spaces, spaceId)
  const spaceUser = user(space, graph)
  const spaceOrganization = organization(space, graph)
  const userOrganizationMemberships = graph.userOrganizationMemberships
  dGraph.user = spaceUser
  dGraph.organization = spaceOrganization
  dGraph.calculators = (graph.calculators || []).filter(c => c.space_id === spaceId)
  dGraph.editableByMe = canEdit(space, graph.me, userOrganizationMemberships)
  return dGraph
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
