import { createSelector } from 'reselect'
import e from 'gEngine/engine'

const NAME = "Denormalized Space Selector"

function _sameId(idA, idB){
  return idA.toString() === idB.toString()
}

function checkpointMetadata(id, checkpoints) {
  let attributes = {head: 0, length: 1}
  let spaceCheckpoints = checkpoints.find(i => _sameId(i.spaceId, id))
  if (!_.isEmpty(spaceCheckpoints)) {
    attributes = {head: spaceCheckpoints.head, length: spaceCheckpoints.checkpoints.length}
  }
  return attributes
}

const SPACE_GRAPH_PARTS = [
  'spaces',
  'calculators',
  'metrics',
  'guesstimates',
  'simulations',
  'users',
  'organizations',
  'userOrganizationMemberships',
  'me',
  'checkpoints',
  'facts',
]

const spaceGraphSelector = state => {
  window.recorder.recordSelectorStart(NAME)
  return _.pick(state, SPACE_GRAPH_PARTS)
}
const spaceIdSelector = (_, {spaceId}) => spaceId
const canvasStateSelector = state => state.canvasState

export const denormalizedSpaceSelector = createSelector(
  spaceGraphSelector,
  spaceIdSelector,
  canvasStateSelector,
  (graph, spaceId, canvasState) => {
    const {facts: {organizationFacts}} = graph
    let denormalizedSpace = e.space.toDSpace(spaceId, graph, organizationFacts)

    if (denormalizedSpace) {
      denormalizedSpace.canvasState = canvasState
      denormalizedSpace.checkpointMetadata = checkpointMetadata(spaceId, graph.checkpoints)
    }

    const {organization_id} = denormalizedSpace
    const organization = graph.organizations.find(o => o.id == organization_id)
    const variableName = e.organization.organizationReadableId(organization)

    const oldOrganizationFactChildren = e.collections.gget(organizationFacts, variableName, 'variable_name', 'children')
    const exportedFacts = e.collections.filter(oldOrganizationFactChildren, spaceId, 'exported_from_id')

    window.recorder.recordSelectorStop(NAME, {denormalizedSpace})
    return { denormalizedSpace, exportedFacts, organizationHasFacts: !_.isEmpty(oldOrganizationFactChildren) }
  }
)
