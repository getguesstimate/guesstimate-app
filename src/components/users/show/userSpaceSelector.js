import { createSelector } from 'reselect';
import e from 'gEngine/engine'

const spaceSelector = state => state.spaces
const userIdSelector = (state, props) => props.userId

export const userSpaceSelector = createSelector(
  spaceSelector,
  userIdSelector,
  (spaces, userId) => {
    return {
      userSpaces: spaces.filter(s => (s.user_id.toString()) === userId.toString())
    }
  }
);
