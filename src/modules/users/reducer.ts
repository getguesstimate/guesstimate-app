import _ from "lodash";
import { AnyAction, Reducer } from "redux";
import reduxCrud from "redux-crud";
import SI from "seamless-immutable";

const standardReducers = reduxCrud.reducersFor("users");

type State = any; // FIXME

export const usersR: Reducer<State, AnyAction> = (state, action) => {
  switch (action.type) {
    case "USER_ORGANIZATION_MEMBERSHIPS_FETCH_SUCCESS": {
      const users = _.get(action, "data.users");
      if (!users || users.length === 0) {
        return state;
      }

      const updatedUsers = users.map((u) => ({
        ...state.find((s) => s.id === u.id),
        ...u,
      }));
      return SI([
        ...state.filter((s) => !_.some(users, (u) => s.id === u.id)),
        ...updatedUsers,
      ]);
    }
    default:
      return standardReducers(state, action);
  }
};
