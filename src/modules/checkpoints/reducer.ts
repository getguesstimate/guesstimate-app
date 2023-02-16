import { AnyAction, Reducer } from "redux";

type CheckpointEntry = {
  spaceId: number;
  head: number;
  checkpoints: any[];
};

export type CheckpointsState = CheckpointEntry[];

export const checkpointsR: Reducer<CheckpointsState, AnyAction> = (
  state = [],
  action
) => {
  switch (action.type) {
    case "INITIALIZE":
      // TODO(matthew): Eliminate this endpoint somehow.
      return [
        { spaceId: action.spaceId, head: 0, checkpoints: [action.checkpoint] },
        ...state,
      ];
    case "SAVE_CHECKPOINT": {
      const entry = state.find((r) => r.spaceId === action.spaceId);
      if (!entry) {
        console.warn(`Space ${action.spaceId} is uninitialized`);
        return state;
      }
      const { spaceId, head, checkpoints } = entry;
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
