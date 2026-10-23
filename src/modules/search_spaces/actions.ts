import { searchError } from "~/lib/errors/index";
import * as spaceActions from "~/modules/spaces/actions";
import { AppThunk } from "~/modules/store";
import * as userActions from "~/modules/users/actions";
import { searchSpaceIndex } from "~/server/algolia/index";
import { ModelSearchHit, SearchFilters } from "./reducer";

export type SearchSortBy = "RECENT" | "RECOMMENDED";
let nextRequestId = 0;

export function fetch(
  query = "",
  options: { sortBy: SearchSortBy; page?: number }
): AppThunk {
  const filters: SearchFilters = { hitsPerPage: 21, page: options.page || 0 };
  const { sortBy } = options;
  if (sortBy === "RECOMMENDED") filters.facetFilters = ["is_recommended: true"];
  return async (dispatch, getState) => {
    const requestId = ++nextRequestId;
    dispatch({
      type: "SEARCH_SPACES_START",
      request: { requestId, query, sortBy, filters },
    });
    try {
      const results = await searchSpaceIndex().search<ModelSearchHit>(
        query,
        filters
      );
      if (getState().searchSpaces.requestId !== requestId) return;
      dispatch({
        type: "SEARCH_SPACES_GET",
        requestId,
        response: { ...results, filters, sortBy },
      });
      dispatch(spaceActions.fromSearch(results.hits));
      dispatch(userActions.fromSearch(results.hits));
    } catch (error) {
      dispatch({ type: "SEARCH_SPACES_ERROR", requestId, more: false });
      searchError("AlgoliaFetch", error);
    }
  };
}

export function fetchNextPage(): AppThunk {
  return async (dispatch, getState) => {
    const current = getState().searchSpaces;
    if (
      current.status === "loading" ||
      current.status === "loadingMore" ||
      current.page >= current.nbPages - 1
    )
      return;
    const requestId = ++nextRequestId;
    dispatch({ type: "SEARCH_SPACES_MORE_START", requestId });
    try {
      const results = await searchSpaceIndex().search<ModelSearchHit>(
        current.query,
        {
          ...current.filters,
          page: current.page + 1,
        }
      );
      if (getState().searchSpaces.requestId !== requestId) return;
      dispatch({
        type: "SEARCH_SPACES_NEXT_PAGE",
        requestId,
        response: results,
      });
      dispatch(spaceActions.fromSearch(results.hits));
      dispatch(userActions.fromSearch(results.hits));
    } catch (error) {
      dispatch({ type: "SEARCH_SPACES_ERROR", requestId, more: true });
      searchError("AlgoliaFetchNextPage", error);
    }
  };
}
