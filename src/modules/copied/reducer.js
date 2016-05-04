export const copiedR = (state = null, action) => {
  switch (action.type) {
    case 'COPY':
      return action.copied
    default:
      return state
  }
}
