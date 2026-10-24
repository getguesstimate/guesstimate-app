import { Reducer } from "redux";
import { SearchSortBy } from "./actions";

export type ModelSearchHit = {
  id: number;
  objectID: string;
  is_private?: boolean;
  name?: string;
  description?: string;
  big_screenshot?: string;
  updated_at?: string;
  user_info?: { id: number; name?: string; picture?: string };
  organization_info?: { id: number; name?: string; picture?: string };
};

export type SearchFilters = {
  hitsPerPage: number;
  page: number;
  numericFilters?: string;
  facetFilters?: string[];
};

type SearchSpacesState = {
  hits: ModelSearchHit[];
  query: string;
  sortBy: SearchSortBy;
  filters: SearchFilters;
  page: number;
  nbPages: number;
  nbHits: number;
  requestId: number;
  scrollY: number;
  status: "idle" | "loading" | "loadingMore" | "ready" | "error";
  error: "search" | "more" | null;
};

const initialState: SearchSpacesState = {
  hits: [],
  query: "",
  sortBy: "RECOMMENDED",
  filters: { hitsPerPage: 21, page: 0 },
  page: 0,
  nbPages: 0,
  nbHits: 0,
  requestId: 0,
  scrollY: 0,
  status: "idle",
  error: null,
};

export const searchSpacesR: Reducer<SearchSpacesState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SEARCH_SPACES_SAVE_SCROLL":
      return { ...state, scrollY: action.scrollY };
    case "SEARCH_SPACES_START":
      return { ...initialState, ...action.request, status: "loading" };
    case "SEARCH_SPACES_MORE_START":
      return {
        ...state,
        requestId: action.requestId,
        status: "loadingMore",
        error: null,
      };
    case "SEARCH_SPACES_GET":
      if (action.requestId !== state.requestId) return state;
      return { ...state, ...action.response, status: "ready", error: null };
    case "SEARCH_SPACES_NEXT_PAGE": {
      if (action.requestId !== state.requestId) return state;
      const ids = new Set(state.hits.map((hit) => hit.id));
      return {
        ...state,
        page: action.response.page,
        nbPages: action.response.nbPages,
        nbHits: action.response.nbHits,
        hits: [
          ...state.hits,
          ...action.response.hits.filter(
            (hit: ModelSearchHit) => !ids.has(hit.id)
          ),
        ],
        status: "ready",
        error: null,
      };
    }
    case "SEARCH_SPACES_ERROR":
      if (action.requestId !== state.requestId) return state;
      return {
        ...state,
        status: "error",
        error: action.more ? "more" : "search",
      };
    default:
      return state;
  }
};
