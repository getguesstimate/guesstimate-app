import { createSelector } from 'reselect';
import e from 'gEngine/engine'
import _ from 'lodash'

const spaceGraphSelector = state => {return _.pick(state, 'metrics', 'guesstimates', 'simulations')};
const spaceIdSelector = (state, props) => {return props.spaceId};
const spaceSelector = (state, props) => {return state.spaces.find(s => s.id === props.spaceId)};

export const denormalizedSpaceSelector = createSelector(
  spaceGraphSelector,
  spaceSelector,
  (graph, space) => {
    return {
      denormalizedSpace: Object.assign(space.asMutable(), e.space.toDgraph(space.id, graph))
    };
  }
);
