import AbstractResource, { Callback } from "../AbstractResource";

import * as yup from "yup";

export const userSchema = yup.object({
  id: yup.number().required(),
  picture: yup.string(),
  name: yup.string(),
});

const userListSchema = yup.object({
  items: yup.array().of(userSchema).required(),
});

const userMembershipsSchema = yup.object({
  items: yup.array().of(
    yup.object({
      id: yup.number(),
      user_id: yup.number(),
      organization_id: yup.number(),
    })
  ),
});

export type ApiUser = yup.InferType<typeof userSchema>;

export type ApiUserList = yup.InferType<typeof userListSchema>;

export type ApiUserMemberships = yup.InferType<typeof userMembershipsSchema>;

export default class Users extends AbstractResource {
  async get({ userId }): Promise<ApiUser> {
    const url = `users/${userId}`;
    const method = "GET";

    const response = await this.call({ url, method });
    const result = await userSchema.validate(response);
    return result;
  }

  async listWithAuth0Id(auth0_id: string): Promise<ApiUserList> {
    const url = `users?auth0_id=${auth0_id}`;
    const method = "GET";

    const response = await this.call({ url, method });
    const result = await userListSchema.validate(response);
    return result;
  }

  async getMemberships({ userId }): Promise<ApiUserMemberships> {
    const response = await this.call({
      url: `users/${userId}/memberships`,
      method: "GET",
    });
    const result = await userMembershipsSchema.validate(response);
    return result;
  }

  finishedTutorial({ id }, callback: Callback) {
    const url = `users/${id}/finished_tutorial`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method })(callback);
  }
}
