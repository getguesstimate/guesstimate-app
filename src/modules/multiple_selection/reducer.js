export default function selection(state = [], action) {
  switch (action.type) {
  case 'MULTIPLE_SELECT':
    return [action.corner1, action.corner2];
  default:
    return state
  }
}
