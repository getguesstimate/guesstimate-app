
export function isWithinRegion(location, region) {
  return (
    location.row >= region[0].row &&
    location.row <= region[1].row &&
    location.column >= region[0].column &&
    location.column <= region[1].column
  )
}

// Returns a function that translates all points of the form {row: X, column: Y} according to the translation that moves
// start to end.
export function translate(start, end) {
  return l => ({row: l.row + (end.row - start.row), column: l.column + (end.column - start.column)})
}
