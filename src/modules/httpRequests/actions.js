export const start = ({ id, entity, metadata }) => {
  return { type: "HTTP_REQUEST_START", id, entity, metadata };
};

export const success = ({ id, response }) => {
  return { type: "HTTP_REQUEST_SUCCESS", id, response };
};

export const failure = ({ id, error }) => {
  return { type: "HTTP_REQUEST_FAILURE", id, error };
};
