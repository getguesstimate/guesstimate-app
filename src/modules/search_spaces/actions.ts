import _ from "lodash";
import * as spaceActions from "gModules/spaces/actions";
import { AppThunk } from "gModules/store";
import * as userActions from "gModules/users/actions";

import { searchError } from "lib/errors/index";

import { searchSpaceIndex } from "servers/algolia/index";

export function fetch(query = "", options: any = {}): AppThunk {
  let filters: any = { hitsPerPage: 21 };
  filters.page = options.page || 0;
  const { sortBy } = options;

  const secondsAtNow = new Date().getTime() / 1000;
  const secondsInMonth = 60 * 60 * 24 * 30;

  if (sortBy === "POPULAR" && _.get(options, "timeframe") === "MONTHLY") {
    filters.numericFilters = `created_at_i>${secondsAtNow - secondsInMonth}`;
  }

  if (sortBy === "RECOMMENDED") {
    filters.facetFilters = ["is_recommended: true"];
  }

  const spaceIndex = {
    RECENT: "RECENT",
    POPULAR: "POPULAR",
    RECOMMENDED: "POPULAR",
  }[sortBy];

  return (dispatch) => {
    searchSpaceIndex(spaceIndex).search(query, filters, (error, results) => {
      if (error) {
        searchError("AlgoliaFetch", error);
      } else {
        results.filters = filters;
        results.sortBy = sortBy;
        dispatch({ type: "SEARCH_SPACES_GET", response: results });
        dispatch(spaceActions.fromSearch(results.hits));
        dispatch(userActions.fromSearch(results.hits));
      }
    });
  };
}

export function fetchNextPage(): AppThunk {
  return (dispatch, getState) => {
    const searchSpaces = getState().searchSpaces;

    searchSpaceIndex(searchSpaces.sortBy).search(
      searchSpaces.query,
      { ...searchSpaces.filters, page: searchSpaces.page + 1 },
      (error, results) => {
        if (error) {
          searchError("AlgoliaFetchNextPage", error);
        } else {
          dispatch({ type: "SEARCH_SPACES_NEXT_PAGE", response: results });
          dispatch(spaceActions.fromSearch(results.hits));
          dispatch(userActions.fromSearch(results.hits));
        }
      }
    );
  };
}
