import { AnyAction, Reducer } from "redux";
import { MaybeRegion } from "~/lib/locationUtils";

export const selectedRegionR: Reducer<MaybeRegion, AnyAction> = (
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
