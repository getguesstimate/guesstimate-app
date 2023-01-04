import { MaybeRegion } from "~/lib/locationUtils";
import { AnyAction, Reducer } from "redux";

export type SelectedRegionState = MaybeRegion;

export const selectedRegionR: Reducer<SelectedRegionState, AnyAction> = (
  state = [],
  action
) => {
  switch (action.type) {
    case "MULTIPLE_SELECT":
      return [action.corner1, action.corner2];
    case "MULTIPLE_DE_SELECT":
      return [];
    default:
      return state;
  }
};
