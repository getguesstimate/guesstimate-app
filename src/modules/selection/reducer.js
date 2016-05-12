export default function selection(state = {}, action) {
  switch (action.type) {
  case 'CHANGE_SELECT':
    console.log("Selecting", action.location)
    return action.location;
  case 'DE_SELECT':
    return {}
  default:
    return state
  }
}
