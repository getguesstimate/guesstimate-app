import _ from "lodash";
import reduxCrud from "redux-crud";

import { get } from "gEngine/collections";
import { AnyAction, Reducer } from "redux";

const standardReducers = reduxCrud.reducersFor("organizations");

type OrganizationsState = any[];

export const organizationsR: Reducer<OrganizationsState, AnyAction> = (
  state = [],
  action
) => {
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
      return [
        ...state.filter((s) => !_.some(organizations, (o) => s.id === o.id)),
        ...updatedOrgs,
      ];
    }
    default:
      return standardReducers(state, action);
  }
};
