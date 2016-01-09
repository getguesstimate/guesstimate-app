import algoliasearch from 'algoliasearch'
import {searchSpaceIndex} from '../../server/algolia/index.js'
import {searchError} from 'lib/errors/index.js'
import * as spaceActions from 'gModules/spaces/actions'
import * as userActions from 'gModules/users/actions'

export function fetch(query = '', options = {}) {
  let filters = {hitsPerPage: 20}
  filters.page = options.page || 0
  if (options.user_id) {
    filters.numericFilters = `user_id=${options.user_id}`
  } else {
    filters.numericFilters = `metric_count>2`
  }

  return (dispatch, getState) => {
    searchSpaceIndex().search(query, filters, (error, results) => {
      if (error) {
        searchError('AlgoliaFetch', error)
      }
      else {
        results.filters = filters
        dispatch({ type: 'SEARCH_SPACES_GET', response: results })
        dispatch(spaceActions.fromSearch(results.hits))
        dispatch(userActions.fromSearch(results.hits))
      }
    })
  }
}


export function fetchNextPage() {
  return (dispatch, getState) => {
    const searchSpaces = getState().searchSpaces
    let {page, filters} = searchSpaces

    filters.page = page + 1

    searchSpaceIndex().search(searchSpaces.query, filters, (error, results) => {
      if (error) {
        searchError('AlgoliaFetchNextPage', error)
      } else {
        dispatch({ type: 'SEARCH_SPACES_NEXT_PAGE', response: results })
        dispatch(spaceActions.fromSearch(results.hits))
        dispatch(userActions.fromSearch(results.hits))
      }
    })
  }
}
