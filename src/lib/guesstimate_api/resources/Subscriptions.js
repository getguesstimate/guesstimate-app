import AbstractResource from '../AbstractResource.js'

export default class Subscriptions extends AbstractResource {
  get_new_iframe(callback) {
    const url = '/subscriptions/new'
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }

  get_portal(callback) {
    const url = '/subscriptions/portal'
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }

  synchronize(callback) {
    const url = '/subscriptions/synchronization'
    const method = 'POST'
    const data = {}

    this.guesstimateMethod({url, method, data})(callback)
  }
}
