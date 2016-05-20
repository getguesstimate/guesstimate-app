export function saveCheckpoint(spaceId, newGraph) {
  return (dispatch, getState) => {
    dispatch({type: 'SAVE_CHECKPOINT', checkpoint: newGraph, spaceId})
  }
}

export function initSpace(spaceId, graph) {
  return (dispatch, getState) => {
    dispatch({type: 'INITIALIZE', checkpoint: graph, spaceId})
  }
}

// TODO(matthew): UNDO & REDO need to update current metrics and guesstimates :/
export function undo(spaceId) {
  return (dispatch, getState) => {
    dispatch({type: 'UNDO', spaceId})
  }
}

export function redo(spaceId) {
  return (dispatch, getState) => {
    dispatch({type: 'REDO', spaceId})
  }
}
