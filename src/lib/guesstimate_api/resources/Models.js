import AbstractResource from '../AbstractResource.js'

export default class Models extends AbstractResource {
  list(msg, callback) {
    const url = `users/${msg.userId}/spaces`
    const method = 'GET'

    this.guesstimateMethod({url, method})(msg, callback)
  }

  get(msg, callback) {
    const url = `spaces/${msg.spaceId}`
    const method = 'GET'

    this.guesstimateMethod({url, method})(msg, callback)
  }
}
