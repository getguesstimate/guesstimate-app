export const copy = () => {
  return (dispatch, getState) => {
    const location = getState().selection
    const metric = getState().metrics.find(m => m.location == location)
    dispatch({type: "COPY", metric})
  }
}

export const paste = () => {
  return (dispatch, getState) => {
    const location = getState().selection
  }
}
