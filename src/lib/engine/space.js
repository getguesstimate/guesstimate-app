import * as _graph from './graph'
import * as _dGraph from './dgraph'
import * as _metric from './metric'
import * as _guesstimate from './guesstimate'
import * as _factBank from './factBank'
import * as _userOrganizationMemberships from './userOrganizationMemberships'

let call = 0

export function url (space) {
  return (!!space) ? ('/models/' + space.id) : ''
}

export function get(collection, id){
  return collection.find(i => (i.id === id))
}

export function subset(graph, spaceId, organizationId){
  if (spaceId){
    const directMetrics = graph.metrics.filter(m => m.space === spaceId)
    const rawGuesstimates = _.flatten(directMetrics.map(m => _metric.guesstimates(m, graph)))
    const directSimulations = _.flatten(rawGuesstimates.map(g => _guesstimate.simulations(g, graph)))

    const factHandles = _.flatten(rawGuesstimates.map(_guesstimate.extractFactHandles)).filter(h => !_.isEmpty(h))
    const relevantFactSelectors = factHandles.map(h => [h, _factBank.resolveToSelector(h, organizationId)])
    const relevantFacts =
      relevantFactSelectors
      .map(([h, s]) => ([h, s, _factBank.findBySelector(graph.globals, s)]))
      .filter(([_1, _2, f]) => !!f.variable_name)

    let readableIds = directMetrics.map(m => m.readableId)
    let factMetrics = []
    let factHandleMap = {}
    relevantFacts.forEach(([handle, selector, _]) => {
      const metric = _factBank.toMetric(selector, readableIds)
      factMetrics = [...factMetrics, metric]
      readableIds = [...readableIds, metric.readableId]
      factHandleMap[handle] = metric.readableId
    })

    const directGuesstimates = rawGuesstimates.map(g => _guesstimate.translateFactHandles(g, factHandleMap))

    const metrics = [...directMetrics, ...factMetrics]

    const guesstimates = [...directGuesstimates, ...relevantFacts.map(([_, selector, fact]) => _factBank.toGuesstimate(selector, fact))]
    const simulations = [...directSimulations, ...relevantFacts.map(([_, selector, fact]) => _factBank.toSimulation(selector, fact))]
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

export function toDSpace(spaceId, graph) {
  let space = graph.spaces && graph.spaces.find(s => sameIds(s.id, spaceId))
  if (!space) { return {} }

  let dSpace = Object.assign(space.asMutable(), toDgraph(space.id, graph))

  dSpace.edges = _dGraph.dependencyMap(dSpace)

  dSpace.metrics = dSpace.metrics.map(s => {
    let edges = {}
    edges.inputs = dSpace.edges.filter(i => i.output === s.id).map(e => e.input)
    edges.outputs = dSpace.edges.filter(i => i.input === s.id).map(e => e.output)
    edges.inputMetrics = edges.inputs.map(i => dSpace.metrics.find(m => m.id === i))
    return Object.assign({}, s, {edges})
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
