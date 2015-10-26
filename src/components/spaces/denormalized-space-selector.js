import { createSelector } from 'reselect';
import e from 'gEngine/engine'

const spaceGraphSelector = state => {return _.pick(state, 'spaces', 'metrics', 'guesstimates', 'simulations', 'users', 'me')};
const spaceSelector = (state, props) => {return state.spaces.find(s => s.id.toString() === props.spaceId.toString())};

export const denormalizedSpaceSelector = createSelector(
  spaceGraphSelector,
  spaceSelector,
  (graph, space) => {
    let dSpace = space && Object.assign(space.asMutable(), e.space.toDgraph(space.id, graph))
    dSpace && (dSpace.edges = e.dgraph.dependencyMap(dSpace))
    return {
      denormalizedSpace: dSpace
    };
  }
);
