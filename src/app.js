import app from 'ampersand-app'
import Router from './router'
import styles from './css/main.styl'
import bootstrap from "../node_modules/bootstrap/dist/css/bootstrap.css"
import Me from './models/me'
import Firebase from 'firebase'

window.app = app

app.extend({
  init () {
    this.firebase = new Firebase("https://brilliant-inferno-9726.firebaseio.com/")
    this.firebase.child('repos').on('value', (snapshot) => {
      let val = snapshot.val()
      if (!Array.isArray(val)) {
        val = [val]
      }
      this.allRepos = _.map(val, function(n){return _.values(n)})[0]
      this.me = new Me()
      this.router = new Router()
      this.router.history.start()
    })
  }
})

app.init()
