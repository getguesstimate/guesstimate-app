import { api } from "~/lib/guesstimate_api";
import { AppThunk } from "~/modules/store";
import { fetchSuccess } from "~/modules/organizations/actions";
import * as memberships from "~/modules/userOrganizationMemberships/actions";
import * as invitations from "~/modules/userOrganizationInvitations/actions";

export function createOrganization(
  name: string,
  plan: number
): AppThunk<Promise<{ id: number; name: string }>> {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      api(getState()).organizations.create(
        { organization: { name, plan } },
        (error, organization) => {
          if (error || !organization?.id) {
            reject(error || new Error("No organization returned"));
            return;
          }
          dispatch(fetchSuccess([organization]));
          resolve(organization);
        }
      );
    });
}

export function inviteMember(
  organizationId: number,
  email: string
): AppThunk<Promise<boolean>> {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      api(getState()).organizations.addMember(
        { organizationId, email },
        (error, invitation) => {
          if (error || !invitation) {
            reject(error || new Error("No invitation returned"));
            return;
          }
          dispatch(invitations.fetchSuccess([invitation]));
          const membership = invitation._embedded?.membership;
          if (membership) dispatch(memberships.fetchSuccess([membership]));
          resolve(!!membership);
        }
      );
    });
}
