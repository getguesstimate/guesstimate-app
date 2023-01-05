import _ from "lodash";
import { AnyAction } from "redux";
import reduxCrud from "redux-crud";

const standardReducers = reduxCrud.List.reducersFor(
  "userOrganizationInvitations"
);

export const userOrganizationInvitationsR = (
  state: any,
  memberships: any,
  action: AnyAction
) => {
  switch (action.type) {
    case "USER_ORGANIZATION_MEMBERSHIPS_DELETE_SUCCESS": {
      const membership = memberships.find((e) => e.id === action.record.id);
      return state.filter((e) => e.id !== _.get(membership, "invitation_id"));
    }
    default:
      return standardReducers(state, action);
  }
};
