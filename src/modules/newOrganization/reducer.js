export function newOrganizationR(state = {}, action) {
  switch (action.type) {
    case "CLEAR_NEW_ORGANIZATION":
      return {};
    case "ORGANIZATIONS_CREATE_SUCCESS":
      return action.record;
    default:
      return state;
  }
}
