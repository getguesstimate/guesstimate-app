import Models from './resources/Models.js'

export default class GuesstimateApi {
  constructor(params) {
    this.api_token = params['api_token']
    this.host = params['host']
    this.models = new Models(this)
  }
}
