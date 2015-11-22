import {ID, API_KEY, SPACE_INDEX} from './constants.js'
import algoliasearch from 'algoliasearch'

const algoliaClient = () =>  {
  return algoliasearch(ID, API_KEY)
}

export const searchSpaceIndex = () => {
  return algoliaClient().initIndex(SPACE_INDEX)
}
