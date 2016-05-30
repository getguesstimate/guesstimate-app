import { createSelector } from 'reselect';

const specificHttpRequestSelector = state => state.httpRequests
const organizationIdSelector = (state, props) => props.organizationId

function isExistingMember(request) {
  return !!_.get(request, 'response.hasUser')
}

export const httpRequestSelector = createSelector(
  specificHttpRequestSelector,
  organizationIdSelector,
  (httpRequests, organizationId) => {

    let relevantRequests = httpRequests.filter(r => (
      (r.metadata.organizationId === organizationId) &&
      (r.entity === 'userOrganizationMembershipCreate')
    ))

    let formattedRequests = relevantRequests.map(r => ({
        id: r.id,
        busy: r.busy,
        success: r.success,
        email: r.metadata.email,
        created_at: r.created_at,
        isExistingMember: isExistingMember(r)
    }))

    return {
      httpRequests: formattedRequests
    }
  }
);
