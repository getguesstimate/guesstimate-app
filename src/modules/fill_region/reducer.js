export function fillRegionR(state = [], action) {
  switch (action.type) {
  case 'SELECT_FILL_REGION':
    return [action.corner1, action.corner2]
  case 'DE_SELECT_FILL_REGION':
    return []
  default:
    return state
  }
}
