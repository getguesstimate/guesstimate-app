export default function displayError(state=[{error: 'fooo', message: 'terrible thing!!!!'}], action){
  switch (action.type) {
  case 'NEW_DISPLAY_ERROR':
    return [...state, action.value]
  case 'CLOSE_DISPLAY_ERRORS':
    return [{error: 'fooo', message: 'terrible thing!!!!'}]
  default:
    return state
  }
}

