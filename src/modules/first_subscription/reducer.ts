import _ from "lodash";
import { combineReducers, Reducer } from "redux";
import { initialRequestState, singleEntity } from "../helpers";
import { newFlowState } from "./state_machine";

export const initialState = {
  flowStage: "START",
  iframe: {
    href: null,
    website_name: null,
    request: initialRequestState,
  },
  synchronization: {
    request: initialRequestState,
  },
};

const flowStage: Reducer<any> = (
  state = initialState.flowStage,
  action = { type: null }
) => {
  return newFlowState(state, _.get(action, "type"));
};

const iframe: Reducer<any> = (
  state = initialState.iframe,
  action = { type: null }
) => {
  switch (action.type) {
    case "FIRST_SUBSCRIPTION_IFRAME_FETCH_START":
      return singleEntity(state, action, "START", ["href", "website_name"]);
    case "FIRST_SUBSCRIPTION_IFRAME_FETCH_SUCCESS":
      return singleEntity(state, action, "SUCCESS", ["href", "website_name"]);
    case "FIRST_SUBSCRIPTION_IFRAME_FETCH_FAILURE":
      return singleEntity(state, action, "FAILURE", ["href", "website_name"]);
    default:
      return state;
  }
};

const synchronization: Reducer<any> = (
  state = initialState.iframe,
  action = { type: null }
) => {
  switch (action.type) {
    case "FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_START":
      return singleEntity(state, action, "START", []);
    case "FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_SUCCESS":
      return singleEntity(state, action, "SUCCESS", []);
    case "FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_FAILURE":
      return singleEntity(state, action, "FAILURE", []);
    default:
      return state;
  }
};

export const firstSubscriptionsR = combineReducers({
  flowStage,
  iframe,
  synchronization,
});
