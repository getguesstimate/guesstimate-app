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

  destroy(msg, callback) {
    const url = `spaces/${msg.spaceId}`
    const method = 'DELETE'

    this.guesstimateMethod({url, method})(msg, callback)
  }

  update(spaceId, msg, callback) {
    const url = `spaces/${spaceId}`
    const method = 'PATCH'
    const data = {space: msg}

    this.guesstimateMethod({url, method, data})(msg, callback)
  }

  create(msg, callback) {
    const url = `spaces/`
    const method = 'POST'
    const data = {space: msg}

    this.guesstimateMethod({url, method, data})(msg, callback)
  }
}
