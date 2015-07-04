import app from 'ampersand-app'
import Router from './router'
import styles from './css/main.styl'
import bootstrap from "../node_modules/bootstrap/dist/css/bootstrap.css"
import Me from './models/me'

window.app = app

app.extend({
  init () {
    this.me = new Me()
    this.router = new Router()
    this.router.history.start()
  }
})

app.init()
