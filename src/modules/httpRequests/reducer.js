function findIndex(state, id) {
  return state.findIndex((y) => y.id === id);
}

export const httpRequestsR = (state = [], action) => {
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
    default:
      return state;
  }
};
