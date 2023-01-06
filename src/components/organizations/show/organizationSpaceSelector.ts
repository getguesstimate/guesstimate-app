import { RootState } from "~/modules/store";
import { createSelector } from "reselect";

export const organizationSpaceSelector = createSelector(
  (state: RootState) => state.spaces,
  (_, organizationId: string | number) => organizationId,
  (spaces, organizationId) => {
    return {
      organizationSpaces: spaces.filter(
        (s) =>
          s.organization_id &&
          s.organization_id.toString() === organizationId.toString()
      ),
    };
  }
);
