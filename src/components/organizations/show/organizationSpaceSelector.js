import { createSelector } from 'reselect';

const spaceSelector = state => state.spaces
const organizationIdSelector = (state, props) => props.organizationId

export const organizationSpaceSelector = createSelector(
  spaceSelector,
  organizationIdSelector,
  (spaces, organizationId) => {
    return {
      organizationSpaces: spaces.filter(s => s.organization_id && (s.organization_id.toString() === organizationId.toString()))
    }
  }
);
