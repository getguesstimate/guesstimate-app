import { ApiSpace } from "~/lib/guesstimate_api/resources/Models";
import _ from "lodash";
import { AnyAction, Reducer } from "redux";
import reduxCrud from "redux-crud";

type SpacesState = ApiSpace[];

export const spacesR: Reducer<SpacesState, AnyAction> = (
  state = [],
  action
) => {
  switch (action.type) {
    case "CALCULATORS_FETCH_SUCCESS": {
      if (!_.has(action, "data.space")) {
        return state;
      }

      const { space } = action.data;
      const existingSpace = state.find((s) => s.id === space.id);
      return [
        { ...existingSpace, ...space },
        ...state.filter((s) => s.id !== space.id),
      ];
    }
    default:
      return reduxCrud.reducersFor("spaces")(state, action);
  }
};
