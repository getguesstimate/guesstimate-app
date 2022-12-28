import AbstractResource, { Callback } from "../AbstractResource";

export default class Users extends AbstractResource {
  get({ userId }, callback: Callback) {
    const url = `users/${userId}`;
    const method = "GET";

    this.guesstimateMethod({ url, method })(callback);
  }

  create(msg, callback: Callback) {
    const url = `users/`;
    const method = "POST";
    const data = { user: msg };

    this.guesstimateMethod({ url, method, data })(callback);
  }

  listWithAuth0Id(auth0_id, callback: Callback) {
    const url = `users?auth0_id=${auth0_id}`;
    const method = "GET";

    this.guesstimateMethod({ url, method })(callback);
  }

  getMemberships({ userId }, callback: Callback) {
    const url = `users/${userId}/memberships`;
    const method = "GET";

    this.guesstimateMethod({ url, method })(callback);
  }

  finishedTutorial({ id }, callback: Callback) {
    const url = `users/${id}/finished_tutorial`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method })(callback);
  }
}
