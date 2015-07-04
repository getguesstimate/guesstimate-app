import Collection from 'ampersand-rest-collection'
import Repo from './repo'

export default Collection.extend({
  model: Repo,

  initialize() {
    this.add([
      {name: 'model1'}
    ])
  },

  getByName (name) {
    let model = this.findWhere({name: name})
    return model
  }
})
