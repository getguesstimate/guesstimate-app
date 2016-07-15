import engine from 'gEngine/engine'

// TODO(matthew): Dry up code here (see metrics reducer), make this copying not necessary.
function uniq(items) {
  return _.uniqBy(items.slice().reverse(), 'metric').reverse()
}

export function guesstimatesR(state = [], action) {
  switch (action.type) {
    case 'CALCULATORS_FETCH_SUCCESS': {
      const newGuesstimates = _.get(action, 'data.space.graph.guesstimates') || []
      return uniq([...state, ...newGuesstimates])
    }
    case 'SPACES_FETCH_SUCCESS': {
      const newGuesstimates = _.flatten(action.records.map(e => _.get(e, 'graph.guesstimates'))).filter(e => e)
      return uniq([...state, ...newGuesstimates])
    }
    case 'SPACES_CREATE_SUCCESS': {
      if (!_.has(action, 'record.graph.guesstimates')) { return state }
      const newGuesstimates = _.get(action.record, 'graph.guesstimates').filter(e => e)
      return [...state, ...newGuesstimates]
    }
    case 'ADD_METRIC':
      return uniq([...state, {metric: action.item.id, input: '', guesstimateType: 'NONE', description: ''}])
    case 'ADD_METRICS':
      if (action.newGuesstimates) {
        return uniq([...state, ...action.newGuesstimates])
      } else {
        // Build new guesstimates if not provided
        return uniq([...state, ...action.items.map(item => ({metric: item.id, input: '', guesstimateType: 'NONE', description: ''}))])
      }
    case 'REMOVE_METRICS':
      return state.filter(y => !_.some(action.item.ids, id => y.metric === id))
    case 'CHANGE_GUESSTIMATE':
      const i = state.findIndex(y => y.metric === action.values.metric)
      const newItem = engine.guesstimate.format(action.values)
      if (i !== -1) {
        const newState = [ ...state.slice(0, i), newItem, ...state.slice(i+1, state.length) ]
        return uniq(newState)
      }
    default:
      return state
  }
}
