import { AbstractResource } from "../AbstractResource";

import * as yup from "yup";

export const calculatorSchema = yup.object({
  id: yup.number().required(),
  space_id: yup.number().required(), // technically nullable in DB, but always set
  title: yup.string(),
  content: yup.string(),
  share_image: yup.string(), // always unset
  input_ids: yup.array().of(yup.string().required()).required(),
  output_ids: yup.array().of(yup.string().required()).required(),
  _embedded: yup.object({
    space: yup.object({
      id: yup.number().required(),
      graph: yup.object(),
    }),
  }),
});

type RawApiCalculator = yup.InferType<typeof calculatorSchema>;

// extra care for share_image because our typescript is non-strict yet (https://github.com/DefinitelyTyped/DefinitelyTyped/issues/45100#issuecomment-634873550)
export type ApiCalculator = Omit<RawApiCalculator, "share_image"> &
  Partial<Pick<RawApiCalculator, "share_image">>;

export class Calculators extends AbstractResource {
  async get(calculatorId: number) {
    const response = await this.call({
      method: "GET",
      url: `calculators/${calculatorId}`,
    });
    const result = await calculatorSchema.validate(response);
    return result;
  }

  async destroy(id: number) {
    const url = `calculators/${id}`;
    const method = "DELETE";

    await this.call({
      url,
      method,
    });
  }

  async create(
    spaceId: number,
    data: Omit<ApiCalculator, "id" | "space_id" | "_embedded">
  ) {
    const url = `spaces/${spaceId}/calculators`;
    const method = "POST";

    const response = await this.call({ url, method, data });
    const result = await calculatorSchema.validate(response);
    return result;
  }

  async update(calculatorId: number, data: Omit<ApiCalculator, "_embedded">) {
    const url = `/calculators/${calculatorId}`;
    const method = "PATCH";

    const response = await this.call({ url, method, data });
    const result = await calculatorSchema.validate(response);
    return result;
  }
}
