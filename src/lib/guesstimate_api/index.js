import Models from './resources/Models.js'
import Organizations from './resources/Organizations.js'
import Users from './resources/Users.js'
import Accounts from './resources/Accounts.js'
import Copies from './resources/Copies.js'


export default class GuesstimateApi {
  constructor(params) {
    this.api_token = params['api_token']
    this.host = params['host']
    this.models = new Models(this)
    this.users = new Users(this)
    this.organizations = new Organizations(this)
    this.copies = new Copies(this)
    this.accounts = new Accounts(this)
  }
}
