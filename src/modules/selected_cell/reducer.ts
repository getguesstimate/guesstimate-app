import { AnyAction, Reducer } from "redux";

export type SelectedCell =
  | {}
  | {
      row: number;
      column: number;
      selectedFrom?: "UP" | "DOWN" | "LEFT" | "RIGHT";
    };

export const selectedCellR: Reducer<SelectedCell, AnyAction> = (
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
