import { RootState } from "gModules/store";
import { ApiUser } from "lib/guesstimate_api/resources/Users";
import _ from "lodash";
import * as _userOrganizationMemberships from "./userOrganizationMemberships";

export const url = (u?: { id?: number }) => {
  return u?.id ? urlById(u.id) : "";
};
export const urlById = (id: number) => `/users/${id}`;

export function usersOrganizations(
  user: RootState["me"],
  memberships,
  organizations
) {
  const id = user.id;
  if (!id) {
    return [];
  }
  return _.filter(organizations, (o) =>
    _userOrganizationMemberships.isMember(o.id, id, memberships)
  );
}
