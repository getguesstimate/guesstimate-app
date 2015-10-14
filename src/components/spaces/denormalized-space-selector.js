import { createSelector } from 'reselect';
import e from 'gEngine/engine'
import _ from 'lodash'

const spaceGraphSelector = state => {return _.pick(state, 'spaces', 'metrics', 'guesstimates', 'simulations', 'users', 'me')};
const spaceSelector = (state, props) => {return state.spaces.find(s => s.id.toString() === props.spaceId.toString())};

export const denormalizedSpaceSelector = createSelector(
  spaceGraphSelector,
  spaceSelector,
  (graph, space) => {
    const dSpace = space && Object.assign(space.asMutable(), e.space.toDgraph(space.id, graph))
    return {
      denormalizedSpace: dSpace
    };
  }
);
