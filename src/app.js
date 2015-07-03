import app from 'ampersand-app'
import Router from './router'
import styles from './css/main.css'
import bootstrap from "../node_modules/bootstrap/dist/css/bootstrap.css"

window.app = app

app.extend({
  init () {
    this.router = new Router()
    this.router.history.start()
  }
})

app.init()
