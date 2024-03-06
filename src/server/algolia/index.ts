import algoliasearch from "algoliasearch";

import { ALGOLIA_INDEX, API_KEY, ID } from "./constants";

function algoliaClient() {
  return algoliasearch(ID, API_KEY);
}

export function searchSpaceIndex() {
  return algoliaClient().initIndex(ALGOLIA_INDEX);
}
