import _ from "lodash";
import reduxCrud from "redux-crud";

import * as displayErrorsActions from "~/modules/displayErrors/actions";
import * as membershipActions from "~/modules/userOrganizationMemberships/actions";
import * as userActions from "~/modules/users/actions";

import { captureApiError } from "~/lib/errors/index";

import { AppThunk } from "~/modules/store";
import { api } from "~/lib/guesstimate_api";

const sActions = reduxCrud.actionCreatorsFor("userOrganizationInvitations");
const relevantAttributes = ["id", "email", "organization_id"];

export function fetchByOrganizationId(organizationId: string): AppThunk {
  return (dispatch, getState) => {
    api(getState()).organizations.getInvitations(
      { organizationId },
      (err, invitations) => {
        if (err) {
          dispatch(displayErrorsActions.newError());
          captureApiError("OrganizationsInvitationsFetch", err, {
            url: "fetchMembers",
          });
        } else if (invitations) {
          dispatch(fetchSuccess(invitations.items));

          const memberships = invitations.items
            .map((i) => _.get(i, "_embedded.membership"))
            .filter((m) => !!m);
          dispatch(membershipActions.fetchSuccess(memberships));

          const users = memberships
            .map((m) => _.get(m, "_embedded.user"))
            .filter((u) => !!u);
          dispatch(userActions.fetchSuccess(users));
        }
      }
    );
  };
}

export function fetchSuccess(invitations) {
  const formatted = invitations.map((m) => _.pick(m, relevantAttributes));
  return sActions.fetchSuccess(formatted);
}

export const deleteSuccess = sActions.deleteSuccess;
