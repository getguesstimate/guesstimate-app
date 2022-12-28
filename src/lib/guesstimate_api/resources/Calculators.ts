import AbstractResource, { Callback } from "../AbstractResource";

export class Calculators extends AbstractResource {
  get(calculatorId: string, callback: Callback) {
    const url = `calculators/${calculatorId}`;
    const method = "GET";

    this.guesstimateMethod({ url, method })(callback);
  }

  destroy(id, callback: Callback) {
    const url = `calculators/${id}`;
    const method = "DELETE";

    this.guesstimateMethod({ url, method })(callback);
  }

  create(spaceId, data, callback: Callback) {
    const url = `spaces/${spaceId}/calculators`;
    const method = "POST";

    this.guesstimateMethod({ url, method, data })(callback);
  }

  update(calculatorId, data, callback: Callback) {
    const url = `/calculators/${calculatorId}`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method, data })(callback);
  }
}
