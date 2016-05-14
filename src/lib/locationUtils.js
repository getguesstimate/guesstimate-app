
export function isWithinRegion(location, region) {
  return (
    location.row >= region[0].row &&
    location.row <= region[1].row &&
    location.column >= region[0].column &&
    location.column <= region[1].column
  )
}

