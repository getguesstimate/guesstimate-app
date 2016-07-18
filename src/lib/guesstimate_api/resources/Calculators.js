import AbstractResource from '../AbstractResource.js'

export class Calculators extends AbstractResource {
  get(calculatorId, callback) {
    const url = `calculators/${calculatorId}`
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }

  create(spaceId, data, callback) {
    const url = `spaces/${spaceId}/calculators`
    const method = 'POST'

    this.guesstimateMethod({url, method, data})(callback)
  }
}
