import app from 'ampersand-app'
import Router from './router'
import styles from './css/main.styl'
import Me from './models/me'
import Firebase from 'firebase'

window.app = app

app.extend({
  init () {
    this.firebase = new Firebase("https://brilliant-inferno-9726.firebaseio.com/")
    this.me = new Me()
    this.router = new Router()
    this.router.history.start()
  }
})

app.init()
