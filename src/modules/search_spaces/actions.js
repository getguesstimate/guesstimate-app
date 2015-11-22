import algoliasearch from 'algoliasearch'
import {searchSpaceIndex} from '../../server/algolia/index.js'

export function fetch(query = '', options = {}) {
  let filters = {hitsPerPage: 15}
  filters.page = options.page || 0
  if (options.user_id) {
    filters.numericFilters = `user_id=${options.user_id}`
  }

  return (dispatch, getState) => {
    searchSpaceIndex().search(query, filters, (errors, results) => {
      results.filters = filters
      dispatch({ type: 'SEARCH_SPACES_GET', response: results })
    })
  }
}


export function fetchNextPage() {
  return (dispatch, getState) => {
    const searchSpaces = getState().searchSpaces
    let {page, filters} = searchSpaces

    filters.page = page + 1

    searchSpaceIndex().search(searchSpaces.query, filters, (errors, results) => {
      dispatch({ type: 'SEARCH_SPACES_NEXT_PAGE', response: results })
    })
  }
}
