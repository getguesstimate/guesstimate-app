import app from 'ampersand-app'
import Router from './router'
import styles from './css/main.styl'
import * as spaceActions from './actions/space-actions.js'
window.app = app

app.extend({
  init () {
    this.router = new Router()
    this.router.history.start()
  }
})

app.init()
