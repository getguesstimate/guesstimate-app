import AbstractResource, { Callback } from "../AbstractResource";

export default class Models extends AbstractResource {
  list({ userId, organizationId }: any, callback: Callback) {
    const url = userId
      ? `users/${userId}/spaces`
      : `organizations/${organizationId}/spaces`;
    const method = "GET";

    this.guesstimateMethod({ url, method })(callback);
  }

  get(spaceId: string, shareableLinkToken, callback: Callback) {
    let url = `spaces/${spaceId}`;
    const method = "GET";

    const headers = !!shareableLinkToken
      ? { "Shareable-Link-Token": shareableLinkToken }
      : {};

    this.guesstimateMethod({ url, method, headers })(callback);
  }

  destroy(msg, callback: Callback) {
    const url = `spaces/${msg.spaceId}`;
    const method = "DELETE";

    this.guesstimateMethod({ url, method })(callback);
  }

  update(spaceId: string, msg, callback: Callback) {
    const url = `spaces/${spaceId}`;
    const method = "PATCH";
    const data = { space: msg };

    this.guesstimateMethod({ url, method, data })(callback);
  }

  enableShareableLink(spaceId: string, callback: Callback) {
    const url = `spaces/${spaceId}/enable_shareable_link`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method })(callback);
  }

  disableShareableLink(spaceId: string, callback: Callback) {
    const url = `spaces/${spaceId}/disable_shareable_link`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method })(callback);
  }

  rotateShareableLink(spaceId: string, callback: Callback) {
    const url = `spaces/${spaceId}/rotate_shareable_link`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method })(callback);
  }

  create(msg, callback: Callback) {
    const url = `spaces/`;
    const method = "POST";
    const data = { space: msg };

    this.guesstimateMethod({ url, method, data })(callback);
  }
}
