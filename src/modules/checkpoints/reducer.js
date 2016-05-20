export const checkpointsR = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE':
      console.log('initializing checkpoint', action.checkpoint)
      return [{spaceId: action.spaceId, head: 0, checkpoints: [action.checkpoint]}, ...state]
    case 'SAVE_CHECKPOINT': {
      console.log('saving checkpoint', action.checkpoint)
      const {spaceId, head, checkpoints} = state.find(r => r.spaceId === action.spaceId)
      const newCheckpoints = [action.checkpoint, ...checkpoints.slice(head)]
      return [{spaceId, head: 0, checkpoints: newCheckpoints}, ...state.filter(r => r.spaceId !== spaceId)]
    }
    case 'REDO': {
      console.log("Redoing.")
      const {head, checkpoints, spaceId} = state.find(r => r.spaceId === action.spaceId)
      if (!!head) {return state}
      return [{spaceId, head: head+1, checkpoints}, ...state.filter(r => r.spaceId !== spaceId)]
    }
    case 'UNDO': {
      console.log("Undoing.")
      const {head, checkpoints, spaceId} = state.find(r => r.spaceId === action.spaceId)
      if (head === checkpoints.length - 1) {return state}
      return [{spaceId, head: head-1, checkpoints}, ...state.filter(r => r.spaceId !== spaceId)]
    }
    default:
      return state
  }
}
