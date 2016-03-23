import AbstractResource from '../AbstractResource.js'

export default class Organizations extends AbstractResource {
  get(msg, callback) {
    const url = `organizations/${msg.organizationId}`
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }
}
