import AbstractResource from "../AbstractResource";

import * as yup from "yup";
import { userSchema } from "./Users";

const spaceSchema = yup.object({
  id: yup.number().required(),
  user_id: yup.number(),
  organization_id: yup.number(),
  graph: yup.object(),
  shareable_link_enabled: yup.boolean().default(undefined), // only if current user can edit
  shareable_link_token: yup.boolean().default(undefined), // only if current user can edit
  _embedded: yup
    .object({
      organization: yup
        .object({
          id: yup.number().required(),
          admin_id: yup.number(),
          name: yup.string(),
        })
        .default(undefined),
      user: userSchema.required(),
    })
    .default(undefined),
});

const spaceListSchema = yup.object({
  items: yup.array().of(spaceSchema).required(),
});

export type ApiSpace = yup.InferType<typeof spaceSchema>;
export type ApiSpaceList = yup.InferType<typeof spaceListSchema>;

export default class Models extends AbstractResource {
  async list({ userId, organizationId }: any) {
    const url = userId
      ? `users/${userId}/spaces`
      : `organizations/${organizationId}/spaces`;
    const method = "GET";

    const response = await this.call({ url, method });
    return await spaceListSchema.validate(response);
  }

  async get(spaceId: number, shareableLinkToken: string | null) {
    const url = `spaces/${spaceId}`;
    const method = "GET";

    const headers = shareableLinkToken
      ? { "Shareable-Link-Token": shareableLinkToken }
      : {};

    const response = await this.call({ url, method, headers });
    return await spaceSchema.validate(response);
  }

  async destroy(spaceId: number) {
    const url = `spaces/${spaceId}`;
    const method = "DELETE";

    await this.call({ url, method });
  }

  async update(spaceId: number, msg: ApiSpace) {
    const url = `spaces/${spaceId}`;
    const method = "PATCH";
    const data = { space: msg };

    return await this.call({ url, method, data });
  }

  async enableShareableLink(spaceId: number) {
    const url = `spaces/${spaceId}/enable_shareable_link`;
    const method = "PATCH";

    return await this.call({ url, method });
  }

  async disableShareableLink(spaceId: number) {
    const url = `spaces/${spaceId}/disable_shareable_link`;
    const method = "PATCH";

    return await this.call({ url, method });
  }

  async rotateShareableLink(spaceId: number) {
    const url = `spaces/${spaceId}/rotate_shareable_link`;
    const method = "PATCH";

    return await this.call({ url, method });
  }

  async create(msg: ApiSpace) {
    const url = `spaces/`;
    const method = "POST";
    const data = { space: msg };

    const response = await this.call({ url, method, data });
    return await spaceSchema.validate(response);
  }

  async copy(spaceId: number) {
    const url = `spaces/${spaceId}/copies`;
    const method = "POST";

    const response = await this.call({ url, method });
    return await spaceSchema.validate(response);
  }
}
