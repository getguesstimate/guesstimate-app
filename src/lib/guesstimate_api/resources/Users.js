import AbstractResource from '../AbstractResource.js'

export default class Users extends AbstractResource {
  get(msg, callback) {
    const url = `users/${msg.userId}`
    const method = 'GET'

    this.guesstimateMethod({url, method})(msg, callback)
  }
}
