import AbstractResource from '../AbstractResource.js'

export default class Forks extends AbstractResource {
  create(msg, callback) {
    const url = `spaces/${msg.spaceId}/forks`
    const method = 'POST'

    this.guesstimateMethod({url, method})(callback)
  }
}
