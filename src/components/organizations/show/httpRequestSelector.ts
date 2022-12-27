import _ from "lodash";
import { createSelector } from "reselect";

const specificHttpRequestSelector = (state) => state.httpRequests;
const organizationIdSelector = (state, organizationId) => organizationId;

function isExistingMember(request) {
  return !!_.get(request, "response.hasUser");
}

export const httpRequestSelector = createSelector(
  specificHttpRequestSelector,
  organizationIdSelector,
  (httpRequests, organizationId) => {
    const relevantRequests = httpRequests.filter(
      (r) =>
        r.metadata.organizationId === organizationId &&
        r.entity === "userOrganizationMembershipCreate"
    );

    const formattedRequests = relevantRequests.map((r) => ({
      id: r.id,
      busy: r.busy,
      success: r.success,
      email: r.metadata.email,
      created_at: r.created_at,
      isExistingMember: isExistingMember(r),
    }));

    return {
      httpRequests: formattedRequests,
    };
  }
);
