import AbstractResource from '../AbstractResource.js'

export default class Models extends AbstractResource {
  list({userId, organizationId}, callback) {
    const url = userId ? `users/${userId}/spaces` : `organizations/${organizationId}/spaces`
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }

  get(spaceId, token, callback) {
    let url = `spaces/${spaceId}`
    const method = 'GET'

    // TODO(Ozzie): Offhand, do you know of a better way to do this? Setting it as data does *not* work as this is a
    // GET.
    if (!!token) { url += `?token=${token}` }

    this.guesstimateMethod({url, method})(callback)
  }

  destroy(msg, callback) {
    const url = `spaces/${msg.spaceId}`
    const method = 'DELETE'

    this.guesstimateMethod({url, method})(callback)
  }

  update(spaceId, msg, callback) {
    const url = `spaces/${spaceId}`
    const method = 'PATCH'
    const data = {space: msg}

    this.guesstimateMethod({url, method, data})(callback)
  }

  enableShareableLink(spaceId, callback) {
    const url = `spaces/${spaceId}/enable_shareable_link`
    const method = 'PATCH'

    this.guesstimateMethod({url, method})(callback)
  }

  disableShareableLink(spaceId, callback) {
    const url = `spaces/${spaceId}/disable_shareable_link`
    const method = 'PATCH'

    this.guesstimateMethod({url, method})(callback)
  }

  rotateShareableLink(spaceId, callback) {
    const url = `spaces/${spaceId}/rotate_shareable_link`
    const method = 'PATCH'

    this.guesstimateMethod({url, method})(callback)
  }

  create(msg, callback) {
    const url = `spaces/`
    const method = 'POST'
    const data = {space: msg}

    this.guesstimateMethod({url, method, data})(callback)
  }
}
