import {PropTypes} from 'react'

export const PTLocation = PropTypes.shape({
  column: PropTypes.number,
  row: PropTypes.number
})

export const PTRegion = PropTypes.arrayOf(PTLocation, PTLocation)

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

export function getBounds({start, end}) {
  if (!start || !end) {return []}
  let leftX, topY, rightX, bottomY
  leftX = Math.min(start.row, end.row)
  topY = Math.max(start.column, end.column)
  rightX = Math.max(start.row, end.row)
  bottomY = Math.min(start.column, end.column)
  return [{row: leftX, column: bottomY}, {row: rightX, column: topY}]
}

export const move = ({row, column}, direction) => ({row: row + direction.row, column: column + direction.column})

// Returns a function that translates all points of the form {row: X, column: Y} according to the translation that moves
// start to end.
export function translate(start, end) {
  return l => ({row: l.row + (end.row - start.row), column: l.column + (end.column - start.column)})
}

// Returns a function that can be used to search a list of objects of the form {location: ..., ... } for a value at the
// passed location.
export function existsAtLoc(seekLoc) {
  return e => isAtLocation(e.location, seekLoc)
}
