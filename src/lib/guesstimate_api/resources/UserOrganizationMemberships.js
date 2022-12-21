import AbstractResource from "../AbstractResource.js";

export default class UserOrganizationMemberships extends AbstractResource {
  destroy({ userOrganizationMembershipId }, callback) {
    const url = `user_organization_memberships/${userOrganizationMembershipId}`;
    const method = "DELETE";
    this.guesstimateMethod({ url, method })(callback);
  }
}
