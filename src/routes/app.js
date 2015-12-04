import app from 'ampersand-app'
import Router from './router'
import * as segment from '../server/segment/index.js'

window.app = app

app.extend({
  init () {
    segment.initialize()
    this.router = new Router()
    this.router.history.start()
  }
})

app.init()
