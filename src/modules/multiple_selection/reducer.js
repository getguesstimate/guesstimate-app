export default function selection(state = [{column: 1, row: 1}, {column: 1, row: 1}], action) {
  switch (action.type) {
  case 'MULTIPLE_SELECT':
    console.log("reducer selecting ", action.corner1.row, "x", action.corner2.column, " to ", action.corner2.row,"x",action.corner2.column)
    return [action.corner1, action.corner2];
  default:
    return state
  }
}
