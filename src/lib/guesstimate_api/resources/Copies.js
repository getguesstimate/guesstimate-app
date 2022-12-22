import AbstractResource from "../AbstractResource";

export default class Copies extends AbstractResource {
  create(msg, callback) {
    const url = `spaces/${msg.spaceId}/copies`;
    const method = "POST";

    this.guesstimateMethod({ url, method })(callback);
  }
}
