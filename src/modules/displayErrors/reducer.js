const testExample = [{error: 'foo', message: 'terrible thing!'}]

export default function displayError(state=[], action){
  switch (action.type) {
  case 'NEW_DISPLAY_ERROR':
    return [...state, action.value]
  case 'CLOSE_DISPLAY_ERRORS':
    return []
  default:
    return state
  }
}

