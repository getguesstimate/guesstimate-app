export default function selection(state = {column: 1, row: 1}, action) {
  switch (action.type) {
  case 'CHANGE_SELECT':
    return action.location;
  case 'ADD_METRIC':
    return action.location;
  default:
    return state
  }
}
