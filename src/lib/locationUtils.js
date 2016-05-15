import {PropTypes} from 'react'

export const PTLocation = PropTypes.shape({
  column: PropTypes.number,
  row: PropTypes.number
})

export function isLocation(test) {
  return !!test && (test.hasOwnProperty('row') && test.hasOwnProperty('column'))
}

export function isAtLocation(test, location) {
  return test.row === location.row && test.column === location.column
}

export function isWithinRegion(test, region) {
  if (!test || !region || region.length !== 2) { return false }
  return (
    test.row >= region[0].row &&
    test.row <= region[1].row &&
    test.column >= region[0].column &&
    test.column <= region[1].column
  )
}

// Returns a function that translates all points of the form {row: X, column: Y} according to the translation that moves
// start to end.
export function translate(start, end) {
  return l => ({row: l.row + (end.row - start.row), column: l.column + (end.column - start.column)})
}
