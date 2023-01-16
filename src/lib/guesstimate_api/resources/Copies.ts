import { AbstractResource, Callback } from "../AbstractResource";

export class Copies extends AbstractResource {
  create(msg, callback: Callback) {
    const url = `spaces/${msg.spaceId}/copies`;
    const method = "POST";

    this.guesstimateMethod({ url, method })(callback);
  }
}
