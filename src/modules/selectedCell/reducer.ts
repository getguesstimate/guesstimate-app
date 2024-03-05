import { AnyAction, Reducer } from "redux";
import { CanvasLocation } from "~/lib/locationUtils";

export type SelectedCell =
  | {}
  | (CanvasLocation & {
      selectedFrom?: "UP" | "DOWN" | "LEFT" | "RIGHT";
    });

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
