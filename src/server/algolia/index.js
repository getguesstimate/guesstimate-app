import {ID, API_KEY} from './constants.js'
import algoliasearch from 'algoliasearch'

const algoliaClient = () =>  {
  return algoliasearch(ID, API_KEY)
}

export const searchSpaceIndex = () => {
  return algoliaClient().initIndex('Space')
}
