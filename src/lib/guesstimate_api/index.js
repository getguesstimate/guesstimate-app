import Models from './resources/Models.js'
import Users from './resources/Users.js'
import Subscriptions from './resources/Subscriptions.js'

export default class GuesstimateApi {
  constructor(params) {
    this.api_token = params['api_token']
    this.host = params['host']
    this.models = new Models(this)
    this.users = new Users(this)
    this.subscriptions = new Subscriptions(this)
  }
}
