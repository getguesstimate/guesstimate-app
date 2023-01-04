import { captureApiError } from "~/lib/errors";
import GuesstimateApi from ".";

type RequestParams = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  data?: any;
  headers?: any;
};

export type Callback = (error: unknown | null, response: any | null) => void;

export default class AbstractResource {
  api: GuesstimateApi;

  constructor(api: GuesstimateApi) {
    this.api = api;
  }

  async call({ url, method, data, headers }: RequestParams): Promise<unknown> {
    try {
      const response = await fetch(this.api.host + url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(this.api.api_token
            ? {
                Authorization: `Bearer ${this.api.api_token}`,
              }
            : undefined),
          ...headers,
        },
        ...(data ? { body: JSON.stringify(data) } : {}),
      });
      if (response.status >= 400) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      captureApiError(`${method} ${url}`, err, { url });
      throw err;
    }
  }

  guesstimateMethod({ url, method, data, headers }: RequestParams) {
    return (callback: Callback) => {
      fetch(this.api.host + url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.api.api_token,
          ...headers,
        },
        ...(data ? { body: JSON.stringify(data) } : {}),
      })
        .then((response) => {
          if (response.status >= 400) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((response) => callback(null, response))
        .catch((error) => callback(error, null));
    };
  }
}
