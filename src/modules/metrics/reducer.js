export default function metrics(state = [], action) {
  switch (action.type) {
  case 'SPACES_FETCH_SUCCESS':
    let newMetrics = _.flatten(action.records.map(e => _.get(e, 'graph.metrics'))).filter(e => e)
    return [...state, ...newMetrics]
  case 'ADD_METRIC':
    return [...state, action.item]
  case 'REMOVE_METRIC':
    return state.filter(y => y.id !== action.item.id)
  case 'CHANGE_METRIC':
    const i = state.findIndex(y => y.id === action.item.id);
    if (i !== -1) {
      return [
        ...state.slice(0, i),
        Object.assign(state[i], action.item),
        ...state.slice(i+1, state.length)
      ];
    }
  default:
    return state
  }
}

