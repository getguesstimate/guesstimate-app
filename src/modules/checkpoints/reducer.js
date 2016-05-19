export const checkpointsR = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return [{spaceId: action.spaceId, head: 0, checkpoints: [action.checkpoint]}, ...state]
    case 'SAVE_CHECKPOINT':
      const {checkpoint} = action
      const {spaceId, head, checkpoints} = state.find(r => r.spaceId === spaceId)
      const newCheckpoints = [checkpoint, ...checkpoints.slice(head)]
      return [{spaceId, head: 0, checkpoints: newCheckpoints}, ...state.filter(r => r.spaceId !== spaceId)]
    case 'REDO':
      const {head, checkpoints, spaceId} = state.find(r => r.spaceId === action.spaceId)
      if (!!head) {return state}
      return [{spaceId, head: head+1, checkpoints}, ...state.filter(r => r.spaceId !== spaceId)]
    case 'UNDO':
      const {head, checkpoints, spaceId} = state.find(r => r.spaceId === action.spaceId)
      if (head === checkpoints.length - 1) {return state}
      return [{spaceId, head: head-1, checkpoints}, ...state.filter(r => r.spaceId !== spaceId)]
    default:
      return state
  }
}
