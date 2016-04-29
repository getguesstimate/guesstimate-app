const initialState = {
  metricCardView: 'normal',
  edgeView: 'visible',
  metricClickMode: 'DEFAULT',
  saveState: 'NONE'
}

export default function canvasState(state = initialState, action) {
  switch (action.type) {
  case 'CHANGE_CANVAS_STATE':
    console.log("Changing Canvas State: ", action)
    return Object.assign(state, action.values)
  default:
    return state
  }
}
