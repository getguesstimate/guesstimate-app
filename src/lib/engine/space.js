import * as _graph from './graph';
import * as _metric from './metric';
import * as _guesstimate from './guesstimate';

export function url (space) {
  return (!!space) ? ('/models/' + space.id) : ''
}

export function get(collection, id){
  return collection.find(i => (i.id === id))
}

export function subset(graph, spaceId){
  if (spaceId){
    const metrics = graph.metrics.filter(m => m.space === spaceId);
    const guesstimates = _.flatten(metrics.map(m => _metric.guesstimates(m, graph)));
    const simulations = _.flatten(guesstimates.map(g => _guesstimate.simulations(g, graph)));
    return { metrics, guesstimates, simulations }
  } else {
    return graph
  }
}

export function withGraph(space, graph){
  return {...space, graph: subset(graph, space.id)}
}

const sameIds = (u1, u2) => {
  return u1 && u2 && (u1.toString() === u2.toString())
}

const user = (space, graph) => {
  return graph.users.find(e => sameIds(e.id, space.user_id))
}

const organization = (space, graph) => {
  return graph.organizations.find(e => sameIds(e.id, space.organization_id))
}

export function toDgraph(spaceId, graph){
  let dGraph = _graph.denormalize(subset(graph, spaceId))
  const space = get(graph.spaces, spaceId)
  const spaceUser = user(space, graph)
  const spaceOrganization = organization(space, graph)
  const memberships = graph.memberships
  const amMember = !!_.find(memberships, m => (m.organization_id === _.get(spaceOrganization, 'id') && m.user_id === _.get(graph, 'me.id')))
  dGraph.user = spaceUser
  dGraph.ownedByMe = sameIds(_.get(spaceUser, 'id'), _.get(graph, 'me.id')) || amMember
  return dGraph
}

export function canEdit(space, me){
  return (space.user_id === me.id)
}
