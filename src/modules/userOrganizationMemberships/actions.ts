import _ from "lodash";
import reduxCrud from "redux-crud";

import cuid from "cuid";

import * as displayErrorsActions from "~/modules/displayErrors/actions";
import * as httpRequestActions from "~/modules/httpRequests/actions";
import * as invitationActions from "~/modules/userOrganizationInvitations/actions";
import * as userActions from "~/modules/users/actions";

import { captureApiError } from "~/lib/errors/index";
import { api } from "~/lib/guesstimate_api";

import { AppThunk } from "~/modules/store";

const sActions = reduxCrud.actionCreatorsFor("userOrganizationMemberships");
const relevantAttributes = [
  "id",
  "user_id",
  "organization_id",
  "invitation_id",
] as const;

export function fetchByOrganizationId(organizationId: string): AppThunk {
  return (dispatch, getState) => {
    api(getState()).organizations.getMembers(
      { organizationId },
      (err, memberships) => {
        if (err) {
          dispatch(displayErrorsActions.newError());
          captureApiError("OrganizationsMemberFetch", err, {
            url: "fetchMembers",
          });
        } else if (memberships) {
          dispatch(fetchSuccess(memberships.items));
        }
      }
    );
  };
}

export function fetchByUserId(userId: number): AppThunk {
  return async (dispatch, getState) => {
    try {
      const memberships = await api(getState()).users.getMemberships({
        userId,
      });
      dispatch(fetchSuccess(memberships.items));
    } catch (err) {
      dispatch(displayErrorsActions.newError());
      captureApiError("OrganizationsMemberFetch", err, {
        url: "fetchMembers",
      });
    }
  };
}

export function fetchSuccess(memberships): AppThunk {
  return (dispatch) => {
    const formatted = memberships.map((m) => _.pick(m, relevantAttributes));
    const users = memberships
      .map((m) => _.get(m, "_embedded.user"))
      .filter((u) => !!u);
    const organizations = memberships
      .map((m) => _.get(m, "_embedded.organization"))
      .filter((o) => !!o);
    dispatch(sActions.fetchSuccess(formatted, { users, organizations }));
  };
}

export function destroy(id: string): AppThunk {
  return (dispatch, getState) => {
    dispatch(sActions.deleteStart({ id }));
    api(getState()).userOrganizationMemberships.destroy(
      { userOrganizationMembershipId: id },
      (err, value) => {
        if (err) {
          captureApiError("OrganizationsMemberDestroy", err, {
            url: "destroyOrganizationMember",
          });
        } else {
          dispatch(sActions.deleteSuccess({ id }));
        }
      }
    );
  };
}

export function createWithEmail(
  organizationId: string,
  email: string
): AppThunk {
  return (dispatch, getState) => {
    const cid = cuid();
    let object = { id: cid, organization_id: organizationId };

    dispatch(
      httpRequestActions.start({
        id: cid,
        entity: "userOrganizationMembershipCreate",
        metadata: { organizationId, email },
      })
    );
    api(getState()).organizations.addMember(
      { organizationId, email },
      (err, invitation) => {
        if (err) {
          dispatch(sActions.createError(err, object));
          dispatch(httpRequestActions.failure({ id: cid, error: err }));
        } else if (invitation) {
          dispatch(invitationActions.fetchSuccess([invitation]));

          const membership = _.get(invitation, "_embedded.membership");
          const user = _.get(membership, "_embedded.user");

          if (membership) {
            dispatch(sActions.createSuccess(membership));
          }
          if (user) {
            dispatch(userActions.fetchSuccess([user]));
          }

          dispatch(
            httpRequestActions.success({
              id: cid,
              response: { hasUser: !!user },
            })
          );
        }
      }
    );
  };
}
