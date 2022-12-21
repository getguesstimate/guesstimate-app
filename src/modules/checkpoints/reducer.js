export const checkpointsR = (state = [], action) => {
  switch (action.type) {
    case "INITIALIZE":
      // TODO(matthew): Eliminate this endpoint somehow.
      return [
        { spaceId: action.spaceId, head: 0, checkpoints: [action.checkpoint] },
        ...state,
      ];
    case "SAVE_CHECKPOINT": {
      const { spaceId, head, checkpoints } = state.find(
        (r) => r.spaceId === action.spaceId
      );
      const newCheckpoints = [action.checkpoint, ...checkpoints.slice(head)];
      return [
        { spaceId, head: 0, checkpoints: newCheckpoints },
        ...state.filter((r) => r.spaceId !== spaceId),
      ];
    }
    case "UPDATE_FOR_SPACE": {
      return [
        action.newCheckpoints,
        ...state.filter((r) => r.spaceId !== action.spaceId),
      ];
    }
    default:
      return state;
  }
};
