import reduxCrud  from 'redux-crud'
import SI from 'seamless-immutable'

export function spacesR(state, action) {
  switch(action.type) {
    case 'CALCULATORS_FETCH_SUCCESS': {
      const {space} = action.data
      if (!space) { return state }

      const existingSpace = state.find(s => s.id === space.id)
      return SI([{...existingSpace, ...space}, ...state.filter(s => s.id !== space.id)])
    }
    default:
      return reduxCrud.reducersFor('spaces')(state, action)
  }
}

