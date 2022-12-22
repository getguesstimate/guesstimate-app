import AbstractResource from "../AbstractResource";

export class Calculators extends AbstractResource {
  get(calculatorId, callback) {
    const url = `calculators/${calculatorId}`;
    const method = "GET";

    this.guesstimateMethod({ url, method })(callback);
  }

  destroy(id, callback) {
    const url = `calculators/${id}`;
    const method = "DELETE";

    this.guesstimateMethod({ url, method })(callback);
  }

  create(spaceId, data, callback) {
    const url = `spaces/${spaceId}/calculators`;
    const method = "POST";

    this.guesstimateMethod({ url, method, data })(callback);
  }

  update(calculatorId, data, callback) {
    const url = `/calculators/${calculatorId}`;
    const method = "PATCH";

    this.guesstimateMethod({ url, method, data })(callback);
  }
}
