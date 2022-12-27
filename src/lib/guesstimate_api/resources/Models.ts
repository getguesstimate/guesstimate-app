import AbstractResource from "../AbstractResource";

export default class Models extends AbstractResource {
  list({ userId, organizationId }: any, callback) {
    const url = userId
      ? `users/${userId}/spaces`
      : `organizations/${organizationId}/spaces`;
    const method = "GET";

    this.guesstimateMethod({ url, method })(callback);
  }

  get(spaceId, shareableLinkToken, callback) {
    let url = `spaces/${spaceId}`;
    const method = "GET";

    const headers = !!shareableLinkToken
      ? { "Shareable-Link-Token": shareableLinkToken }
      : {};

    this.guesstimateMethod({ url, method, headers })(callback);
  }

  destroy(msg, callback) {
    const url = `spaces/${msg.spaceId}`;
    const method = "DELETE";

    this.guesstimateMethod({ url, method })(callback);
  }

  update(spaceId, msg, callback) {
    const url = `spaces/${spaceId}`;
    const method = "PATCH";
    const data = { space: msg };

    this.guesstimateMethod({ url, method, data })(callback);
  }

  enableShareableLink(spaceId, callback) {
    const url = `spaces/${spaceId}/enable_shareable_link`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method })(callback);
  }

  disableShareableLink(spaceId, callback) {
    const url = `spaces/${spaceId}/disable_shareable_link`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method })(callback);
  }

  rotateShareableLink(spaceId, callback) {
    const url = `spaces/${spaceId}/rotate_shareable_link`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method })(callback);
  }

  create(msg, callback) {
    const url = `spaces/`;
    const method = "POST";
    const data = { space: msg };

    this.guesstimateMethod({ url, method, data })(callback);
  }
}
