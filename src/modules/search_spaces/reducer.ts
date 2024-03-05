import _ from "lodash";
import { Reducer } from "redux";

// `algoliasearch` package doesn't expose this type, so we have to use this internal package directly
import { type SearchResponse } from "@algolia/client-search";

import { SearchSortBy } from "./actions";

type TObject = {
  // TODO: there are other fields here
  user_info: unknown;
  organization_info: unknown;
};

export type SearchFilters = {
  hitsPerPage: number;
  page: number;
  numericFilters?: string;
  facetFilters?: string[];
};

type SearchSpacesState =
  | (SearchResponse<TObject> & {
      filters: SearchFilters;
      sortBy: SearchSortBy;
    })
  | Record<string, never>;

export const searchSpacesR: Reducer<SearchSpacesState> = (
  state = {},
  action
) => {
  switch (action.type) {
    case "SEARCH_SPACES_GET":
      return action.response;
    case "SEARCH_SPACES_NEXT_PAGE": {
      const newState = _.clone(state);
      newState.page = action.response.page;
      newState.hits = newState.hits.concat(action.response.hits);
      return newState;
    }
    default:
      return state;
  }
};
