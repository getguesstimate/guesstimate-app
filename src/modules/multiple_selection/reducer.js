export default function selection(state = [{column: 1, row: 1}, {column: 1, row: 1}], action) {
  switch (action.type) {
  case 'MULTIPLE_SELECT':
    return [action.corner1, action.corner2];
  default:
    return state
  }
}
