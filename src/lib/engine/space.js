import math from 'mathjs'

import * as _graph from './graph'
import * as _dGraph from './dgraph'
import * as _metric from './metric'
import * as _guesstimate from './guesstimate'
import * as _simulation from './simulation'
import * as _userOrganizationMemberships from './userOrganizationMemberships'
import * as _facts from './facts'
import * as _collections from './collections'
import * as _utils from './utils'

export const spaceUrlById = (id, params = {}) => {
  const root = (!!id) ? `/models/${id}` : ''
  if (!_.isEmpty(params)){
    const param_string = '?' + _.join(_.toPairs(params).map(pair => _.join(pair, '=')), '&')
    return root + param_string
  } else {
    return root
  }
}

export const url = ({id}) => spaceUrlById(id)
import {BASE_URL} from 'lib/constants'

export const urlWithToken = s => s.shareable_link_enabled ? `${BASE_URL}${url(s)}?token=${s.shareable_link_token}` : ''

const TOKEN_REGEX = /token=([^&]+)/
export const extractTokenFromUrl = url => TOKEN_REGEX.test(url) ? url.match(TOKEN_REGEX)[1] : null

export const withGraph = (space, graph) => ({...space, graph: subset(graph, space.id)})

export function prepared(dSpace) {
  const ownerName = _utils.propIsPresent(dSpace, 'organization_id') ? _.get(dSpace, 'organization.name') : _.get(dSpace, 'user.name')
  return _utils.allPresent(dSpace, ownerName)
}

export function subset(state, ...spaceIds) {
  const metrics = _collections.filterByInclusion(state.metrics, 'space', spaceIds)
  const guesstimates = metrics.map(_guesstimate.getByMetricFn(state)).filter(_utils.isPresent)
  const simulations = guesstimates.map(_simulation.getByMetricFn(state)).filter(_utils.isPresent)
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

  let dSpace = {...space, ...toDgraph(space, graph)}

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

function toDgraph(space, graph){
  const {users, organizations, calculators, userOrganizationMemberships, me} = graph
  const {user_id, organization_id} = space

  return {
    ..._graph.denormalize(subset(graph, space.id)),
    user: _collections.get(users, user_id),
    organization: _collections.get(organizations, organization_id),
    calculators: _collections.filter(calculators, space.id, 'space_id'),
    editableByMe: canEdit(space, me, userOrganizationMemberships),
  }
}

export function canEdit({user_id, organization_id}, me, userOrganizationMemberships, canvasState) {
  // TODO(matthew): This first check is hacky. Refactor later.
  if (!_.isEmpty(canvasState) && !!canvasState.editsAllowedManuallySet && !canvasState.editsAllowed) { return false }

  const meId = _.get(me, 'id')
  if (!!organization_id) {
    return _userOrganizationMemberships.isMember(organization_id, meId, userOrganizationMemberships)
  } else {
    return user_id === meId
  }
}
