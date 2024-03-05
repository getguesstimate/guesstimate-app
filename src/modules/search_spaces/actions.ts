import _ from "lodash";
import { searchError } from "~/lib/errors/index";
import * as spaceActions from "~/modules/spaces/actions";
import { AppThunk } from "~/modules/store";
import * as userActions from "~/modules/users/actions";
import { searchSpaceIndex } from "~/server/algolia/index";

import { SearchFilters } from "./reducer";

export type SearchTimeframe = "ALL_TIME" | "MONTHLY";
export type SearchSortBy = "POPULAR" | "RECENT" | "RECOMMENDED";

export function fetch(
  query = "",
  options: { sortBy: SearchSortBy; timeframe: SearchTimeframe; page?: number }
): AppThunk {
  const filters: SearchFilters = { hitsPerPage: 21, page: options.page || 0 };
  const { sortBy } = options;

  const secondsAtNow = new Date().getTime() / 1000;
  const secondsInMonth = 60 * 60 * 24 * 30;

  if (sortBy === "POPULAR" && _.get(options, "timeframe") === "MONTHLY") {
    filters.numericFilters = `created_at_i>${secondsAtNow - secondsInMonth}`;
  }

  if (sortBy === "RECOMMENDED") {
    filters.facetFilters = ["is_recommended: true"];
  }

  return async (dispatch) => {
    try {
      const results = await searchSpaceIndex().search(query, filters);
      dispatch({
        type: "SEARCH_SPACES_GET",
        response: {
          ...results,
          filters,
          sortBy,
        },
      });
      dispatch(spaceActions.fromSearch(results.hits));
      dispatch(userActions.fromSearch(results.hits));
    } catch (error) {
      searchError("AlgoliaFetch", error);
    }
  };
}

export function fetchNextPage(): AppThunk {
  return async (dispatch, getState) => {
    const searchSpaces = getState().searchSpaces;

    try {
      const results = await searchSpaceIndex().search(searchSpaces.query, {
        ...searchSpaces.filters,
        page: searchSpaces.page + 1,
      });
      dispatch({ type: "SEARCH_SPACES_NEXT_PAGE", response: results });
      dispatch(spaceActions.fromSearch(results.hits));
      dispatch(userActions.fromSearch(results.hits));
    } catch (error) {
      searchError("AlgoliaFetchNextPage", error);
    }
  };
}
