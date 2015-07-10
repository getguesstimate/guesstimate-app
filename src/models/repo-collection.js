import Collection from 'ampersand-rest-collection'
import Repo from './repo'

export default Collection.extend({
  model: Repo,

  initialize () {
    //debugger
    //this.add([{name: 'foo', data: {foo: 'bar'}}])
    this.add(app.allRepos)
  },

  getByName (name) {
    let model = this.findWhere({name: name})
    return model
  }
})
