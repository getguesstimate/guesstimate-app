import _ from "lodash";

export const initialRequestState = {
  waiting: false,
  error: null,
  status: "NOT_SENT",
};

function requestReducer(state, type, action = null) {
  switch (type) {
    case "START":
      return {
        waiting: true,
        error: state.error,
        status: "START",
      };
    case "SUCCESS":
      return {
        waiting: false,
        error: null,
        status: "SUCCESS",
      };
    case "FAILURE":
      return {
        waiting: false,
        error: "error!",
        status: "FAILURE",
      };
    default:
      return state;
  }
}

export function singleEntity(state, action, type, keys) {
  const newState =
    type === "SUCCESS"
      ? Object.assign({}, state, _.pick(action.value, keys))
      : state;

  return {
    ...newState,
    request: requestReducer(state.request, type, action),
  };
}
