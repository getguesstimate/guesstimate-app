import { AnyAction, Reducer } from "redux";

export type SelectedCellState =
  | {}
  | {
      row: number;
      column: number;
      selectedFrom?: "UP" | "DOWN" | "LEFT" | "RIGHT";
    };

export const selectedCellR: Reducer<SelectedCellState, AnyAction> = (
  state = {},
  action
) => {
  switch (action.type) {
    case "CHANGE_SELECT":
      return action.selection;
    case "DE_SELECT":
      return {};
    default:
      return state;
  }
};
