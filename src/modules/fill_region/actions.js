export function selectFillRegion(corner1, corner2) {
  let leftX, topY, rightX, bottomY
  leftX = Math.min(corner1.row, corner2.row)
  topY = Math.max(corner1.column, corner2.column)
  rightX = Math.max(corner1.row, corner2.row)
  bottomY = Math.min(corner1.column, corner2.column)
  return { type: 'SELECT_FILL_REGION', corner1: {row: leftX, column: bottomY}, corner2: {row: rightX, column: topY} }
}

export function deSelectFillRegion() {
  return { type: 'DE_SELECT_FILL_REGION' }
}
