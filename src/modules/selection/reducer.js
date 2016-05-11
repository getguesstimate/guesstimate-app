export default function selection(state = {}, action) {
  switch (action.type) {
  case 'CHANGE_SELECT':
    return action.location;
  case 'DE_SELECT':
    return {}
  case 'ADD_METRIC':
    return action.item.location;
  default:
    return state
  }
}
