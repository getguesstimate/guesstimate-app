import Collection from 'ampersand-rest-collection'
import $ from 'jquery'
import Repo from './repo'

let rootUrl = 'http://guesstimate.herokuapp.com/'
export default Collection.extend({
  model: Repo,

  initialize () {
    $.getJSON((rootUrl + 'spaces'), (data) => {
      this.add(data)
    }, 'json')
  },

  destroy (repo) {
    let request = $.ajax({
      url: (rootUrl + 'spaces/' + repo.id),
      method: 'DELETE'
    })
    request.done(() => { this.remove(repo) })
  },

  create (name, description) {
    let request = $.ajax({
      url: (rootUrl + 'spaces/'),
      data: {space: {name, description}},
      method: 'POST'
    })
    request.done(data => this.add(data))
  },

  getByName (name) {
    let model = this.findWhere({name: name})
    return model
  }
})
