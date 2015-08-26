import Collection from 'ampersand-rest-collection'
import Repo from './repo'

export default Collection.extend({
  model: Repo,

  initialize () {
    app.firebase.child('repos').on('value', (snapshot) => {
      let val = snapshot.val()
      if (!Array.isArray(val)) {
        val = [val]
      }
      let repos = _.map(val[0], function(value, key) {
        value.id = key
        return value
      })
      this.add(repos)
    })
  },

  destroy (repo) {
    app.firebase.child('repos').child(repo.id).set({})
    this.remove(repo)
  },

  create (name, description) {
    let repo = {name: name, description: description, data: {nodes: [], edges: []}}
    app.firebase.child('repos').push(repo)
    return ('/repo/' + name)
  },

  getByName (name) {
    let model = this.findWhere({name: name})
    return model
  }
})
