import engine from 'gEngine/engine'

export default function guesstimates(state = [], action) {
  switch (action.type) {
  case 'SPACES_FETCH_SUCCESS':
    let newGuesstimates = _.flatten(action.records.map(e => _.get(e, 'graph.guesstimates'))).filter(e => e)
    return [...state, ...newGuesstimates]
  case 'ADD_METRIC':
    return [...state, {metric: action.item.id, input: '', guesstimateType: 'NONE', description: ''}]
  case 'REMOVE_METRIC':
    return state.filter(y => y.metric !== action.item.id)
  case 'CHANGE_GUESSTIMATE':
    const i = state.findIndex(y => y.metric === action.values.metric);
    if (i !== -1) {
      const newState = [
        ...state.slice(0, i),
        engine.guesstimate.format(action.values),
        ...state.slice(i+1, state.length)
      ];
      return newState
    }
  default:
    return state;
  }
}

