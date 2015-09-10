import { ADD_TODO } from '../constants/ActionTypes';

export default function space(state, action) {
  switch (action.type) {
  case ADD_TODO:
    return [];
  default:
    return state
  }
}
