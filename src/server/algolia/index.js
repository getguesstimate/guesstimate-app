import {ID, API_KEY, SPACE_BY_DATE_INDEX, SPACE_BY_VIEWCOUNT_INDEX} from './constants.js'
import algoliasearch from 'algoliasearch'

const algoliaClient = () =>  {
  return algoliasearch(ID, API_KEY)
}

function index(sort_option){
  return (sort_option === 'VIEWCOUNT') ? SPACE_BY_VIEWCOUNT_INDEX : SPACE_BY_DATE_INDEX
}

export const searchSpaceIndex = (sort_option) => {
  return algoliaClient().initIndex(index(sort_option))
}
