import AbstractResource, { Callback } from "../AbstractResource";

export default class UserOrganizationMemberships extends AbstractResource {
  destroy({ userOrganizationMembershipId }, callback: Callback) {
    const url = `user_organization_memberships/${userOrganizationMembershipId}`;
    const method = "DELETE";
    this.guesstimateMethod({ url, method })(callback);
  }
}
