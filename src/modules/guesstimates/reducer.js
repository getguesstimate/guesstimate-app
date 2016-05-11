import engine from 'gEngine/engine'

function uniq(items) {
  return _.uniqBy(items, 'metric')
}

export default function guesstimates(state = [], action) {
  switch (action.type) {
  case 'SPACES_FETCH_SUCCESS':
    let newGuesstimates = _.flatten(action.records.map(e => _.get(e, 'graph.guesstimates'))).filter(e => e)
    return uniq([...state, ...newGuesstimates])
  case 'ADD_METRIC':
    if (action.newGuesstimate) {
      return uniq([...state, action.newGuesstimate])
    } else {
      // Build a new guesstimate if not provided
      return uniq([...state, {metric: action.item.id, input: '', guesstimateType: 'NONE', description: ''}])
    }
  case 'REMOVE_METRIC':
    return state.filter(y => y.metric !== action.item.id)
  case 'CHANGE_GUESSTIMATE':
    const i = state.findIndex(y => y.metric === action.values.metric);
    const newItem = engine.guesstimate.format(action.values)
    if (i !== -1) {
      const newState = [ ...state.slice(0, i), newItem, ...state.slice(i+1, state.length) ];
      return uniq(newState)
    }
  default:
    return state;
  }
}

