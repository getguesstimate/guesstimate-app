import { createSelector } from 'reselect';
import e from 'gEngine/engine'
import _ from 'lodash'

const spaceGraphSelector = state => {return _.pick(state, 'metrics', 'guesstimates', 'simulations')};
const spaceIdSelector = (state, props) => {return props.spaceId};

export const denormalizedSpaceSelector = createSelector(
  spaceGraphSelector,
  spaceIdSelector,
  (graph, spaceId) => {
    return {
      denormalizedSpace: e.space.toDgraph(spaceId, graph)
    };
  }
);
