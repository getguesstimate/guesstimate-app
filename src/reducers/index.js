import { combineReducers } from 'redux';
import { ADD_TODO } from '../constants/ActionTypes';

export default function metrics(state = [{location: {column: 3, row: 3}}], action) {
  switch (action.type) {
  case ADD_TODO:
    return [];
  default:
    return state
  }
}

export default function selection(state = {column: 1, row: 1}, action) {
  switch (action.type) {
  default:
    return state
  }
}
const rootReducer = combineReducers({
  metrics,
  selection
});

export default rootReducer;
