import { RootState } from "~/modules/store";
import _ from "lodash";
import * as _userOrganizationMemberships from "./userOrganizationMemberships";

export const url = (u: { id?: number } | null | undefined) => {
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
  return organizations.filter((o) =>
    _userOrganizationMemberships.isMember(o.id, id, memberships)
  );
}
