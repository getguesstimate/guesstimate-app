import reduxCrud from "redux-crud";
import SI from "seamless-immutable";

import { get } from "gEngine/collections";

const standardReducers = reduxCrud.reducersFor("organizations");

export function organizationsR(state, action) {
  switch (action.type) {
    case "USER_ORGANIZATION_MEMBERSHIPS_FETCH_SUCCESS": {
      const organizations = _.get(action, "data.organizations");
      if (_.isEmpty(organizations)) {
        return state;
      }

      const updatedOrgs = organizations.map((o) => ({
        fullyLoaded: false,
        ...get(state, o.id),
        ...o,
      }));
      return SI([
        ...state.filter((s) => !_.some(organizations, (o) => s.id === o.id)),
        ...updatedOrgs,
      ]);
    }
    default:
      return standardReducers(state, action);
  }
}
