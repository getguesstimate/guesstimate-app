import { AnyAction, Reducer } from "redux";

function findIndex(state: HttpRequestsState, id) {
  return state.findIndex((y) => y.id === id);
}

export type GHttpRequest = {
  id: string;
  created_at: Date;
  entity: string;
  metadata: any;
  busy: boolean;
  success: boolean;
};

export type HttpRequestsState = GHttpRequest[];

export const httpRequestsR: Reducer<HttpRequestsState, AnyAction> = (
  state = [],
  action
) => {
  let id, request, i;

  switch (action.type) {
    case "HTTP_REQUEST_START":
      request = {
        id: action.id,
        created_at: Date.now(),
        entity: action.entity,
        metadata: action.metadata,
        busy: true,
        success: false,
      };
      return [...state, request];
    case "HTTP_REQUEST_SUCCESS":
      id = action.id;
      i = findIndex(state, id);

      if (i !== -1) {
        request = {
          ...state[i],
          busy: false,
          success: true,
          response: action.response,
        };
        return [
          ...state.slice(0, i),
          request,
          ...state.slice(i + 1, state.length),
        ];
      }
      return state;
    case "HTTP_REQUEST_FAILURE":
      id = action.id;
      i = findIndex(state, id);

      if (i !== -1) {
        request = {
          ...state[i],
          busy: false,
          success: false,
          error: action.error,
        };
        return [
          ...state.slice(0, i),
          request,
          ...state.slice(i + 1, state.length),
        ];
      }
      return state;
    default:
      return state;
  }
};
