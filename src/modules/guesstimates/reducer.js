import {format, uniq} from 'gEngine/guesstimate'

export function guesstimatesR(state = [], action) {
  console.log(action)
  switch (action.type) {
    case 'CALCULATORS_FETCH_SUCCESS': {
      const newGuesstimates = _.get(action, 'data.space.graph.guesstimates') || []
      return uniq([...state, ...newGuesstimates])
    }
    case 'SPACES_FETCH_SUCCESS': {
      const newGuesstimates = _.flatten(action.records.map(e => _.get(e, 'graph.guesstimates'))).filter(e => e)
      console.log('here', newGuesstimates)
      return uniq([...state, ...newGuesstimates])
    }
    case 'SPACES_CREATE_SUCCESS': {
      if (!_.has(action, 'record.graph.guesstimates')) { return state }
      const newGuesstimates = _.get(action.record, 'graph.guesstimates').filter(e => e)
      return [...state, ...newGuesstimates]
    }
    case 'ADD_METRIC':
      return uniq([...state, {metric: action.item.id, input: '', guesstimateType: 'NONE', description: ''}])
    case 'ADD_METRICS': {
      if (action.newGuesstimates) {
        return uniq([...state, ...action.newGuesstimates])
      } else {
        // Build new guesstimates if not provided
        const newGuesstimates = action.items.map(item => ({metric: item.id, input: '', guesstimateType: 'NONE', description: ''}))
        return uniq([...state, ...newGuesstimates])
      }
    }
    case 'REMOVE_METRICS':
      return state.filter(y => !_.some(action.item.ids, id => y.metric === id))
    case 'CHANGE_GUESSTIMATE':
      const i = state.findIndex(y => y.metric === action.values.metric)
      const newItem = format(action.values)
      if (i !== -1) {
        return uniq([...state.slice(0, i), newItem, ...state.slice(i+1, state.length)])
      }
    default:
      return state
  }
}
