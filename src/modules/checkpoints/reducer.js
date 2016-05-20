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
    case 'UPDATE_FOR_SPACE': {
      console.log("updating")
      return [action.newCheckpoints, ...state.filter(r => r.spaceId !== action.spaceId)]
    }
    default:
      return state
  }
}
