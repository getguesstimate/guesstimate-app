import Model from 'ampersand-model'
import RepoCollection from './repo-collection'

export default Model.extend({
  props: {
    id: 'number'
  },

  collections: {
    repos: RepoCollection
  }
})
