import AbstractResource, { Callback } from "../AbstractResource";

export default class Accounts extends AbstractResource {
  get_new_subscription_iframe({ user_id, plan_id }, callback: Callback) {
    const url = `users/${user_id}/account/new_subscription_iframe?plan_id=${plan_id}`;
    const method = "GET";

    this.guesstimateMethod({ url, method })(callback);
  }

  synchronize({ user_id }, callback: Callback) {
    const url = `users/${user_id}/account/synchronization`;
    const method = "POST";
    const data = {};

    this.guesstimateMethod({ url, method, data })(callback);
  }
}
