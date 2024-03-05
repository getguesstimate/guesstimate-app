import _ from "lodash";
import { typeSafeEq } from "./utils";

export const isMember = (
  organization_id: number,
  user_id: number,
  memberships
) =>
  _.some(
    memberships,
    (m) =>
      typeSafeEq(m.organization_id, organization_id) &&
      typeSafeEq(m.user_id, user_id)
  );
