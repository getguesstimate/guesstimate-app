import { createSelector } from 'reselect';
import e from 'gEngine/engine'

const spaceGraphSelector = state => { return _.pick(state, 'spaces', 'metrics', 'guesstimates', 'simulations', 'users', 'organizations', 'memberships', 'me') }
const spaceSelector = (state, props) => {return state.spaces.find(s => s.id.toString() === props.spaceId.toString())}
const canvasStateSelector = state => {return state.canvasState}

export const denormalizedSpaceSelector = createSelector(
  spaceGraphSelector,
  spaceSelector,
  canvasStateSelector,
  (graph, space, canvasState) => {
    let dSpace = space && Object.assign(space.asMutable(), e.space.toDgraph(space.id, graph))

    if (dSpace) {
      dSpace.edges = e.dgraph.dependencyMap(dSpace)
      dSpace.canvasState = canvasState
    }

    return {
      denormalizedSpace: dSpace
    };
  }
);
