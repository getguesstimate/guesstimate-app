import AbstractResource from '../AbstractResource.js'

export default class Organizations extends AbstractResource {
  get({organizationId}, callback) {
    const url = `organizations/${organizationId}`
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }

  getMembers({organizationId}, callback) {
    const url = `organizations/${organizationId}/members`
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }
}
