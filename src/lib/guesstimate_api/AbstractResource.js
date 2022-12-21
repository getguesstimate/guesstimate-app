import $ from "jquery";

export default class AbstractResource {
  constructor(api) {
    this.api = api;
  }

  guesstimateRequest({ url, method, data, headers }) {
    const token = this.api.api_token;
    const host = this.api.host;
    const serverUrl = host + url;

    const allHeaders = { Authorization: "Bearer " + token, ...headers };
    let requestParams = {
      headers: allHeaders,
      dataType: "json",
      contentType: "application/json",
      url: serverUrl,
      method,
    };
    if (data) {
      requestParams.data = JSON.stringify(data);
    }

    return requestParams;
  }

  guesstimateMethod({ url, method, data, headers }) {
    return (callback) => {
      const params = this.guesstimateRequest({ url, method, data, headers });
      const request = $.ajax(params);
      request.done((response) => {
        callback(null, response);
      });
      request.fail((jqXHR, textStatus, errorThrown) => {
        callback({ jqXHR, textStatus, errorThrown }, null);
      });
    };
  }
}
