import _ from "lodash";
import { Reducer } from "redux";

type SearchSpacesState = any;

const search_spaces: Reducer<SearchSpacesState> = (state = [], action) => {
  switch (action.type) {
    case "SEARCH_SPACES_GET":
      return action.response;
    case "SEARCH_SPACES_NEXT_PAGE":
      let newState = _.clone(state);
      newState.page = action.response.page;
      newState.hits = newState.hits.concat(action.response.hits);
      return newState;
    default:
      return state;
  }
};

export default search_spaces;
