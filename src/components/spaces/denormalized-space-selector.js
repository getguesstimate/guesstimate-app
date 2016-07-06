import { createSelector } from 'reselect';
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

const spaceGraphSelector = state => {
  window.recorder.recordSelectorStart(NAME)
  return _.pick(state, 'spaces', 'metrics', 'guesstimates', 'simulations', 'users', 'organizations', 'userOrganizationMemberships', 'me', 'checkpoints')
}
const spaceIdSelector = (_, {spaceId}) => spaceId
const canvasStateSelector = state => state.canvasState

export const denormalizedSpaceSelector = createSelector(
  spaceGraphSelector,
  spaceIdSelector,
  canvasStateSelector,
  (graph, spaceId, canvasState) => {
    let dSpace = e.space.toDSpace(spaceId, graph)

    if (dSpace) {
      dSpace.canvasState = canvasState
      dSpace.checkpointMetadata = checkpointMetadata(spaceId, graph.checkpoints)
    }

    window.recorder.recordSelectorStop(NAME, {denormalizedSpace: dSpace})
    return {
      denormalizedSpace: dSpace
    };
  }
);
