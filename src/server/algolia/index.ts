import algoliasearch from "algoliasearch";

import {
  API_KEY,
  ID,
  SPACE_BY_DATE_INDEX,
  SPACE_BY_VIEWCOUNT_INDEX,
} from "./constants";

function algoliaClient() {
  return algoliasearch(ID, API_KEY);
}

function index(sort_option: "RECENT" | "POPULAR") {
  return sort_option === "POPULAR"
    ? SPACE_BY_VIEWCOUNT_INDEX
    : SPACE_BY_DATE_INDEX;
}

export function searchSpaceIndex(sort_option: "RECENT" | "POPULAR") {
  return algoliaClient().initIndex(index(sort_option));
}
