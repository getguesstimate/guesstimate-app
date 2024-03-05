export const start = ({
  id,
  entity,
  metadata,
}: {
  id: string;
  entity: string;
  metadata: any;
}) => {
  return { type: "HTTP_REQUEST_START", id, entity, metadata };
};

export const success = ({ id, response }: { id: string; response: any }) => {
  return { type: "HTTP_REQUEST_SUCCESS", id, response };
};

export const failure = ({ id, error }: { id: string; error: any }) => {
  return { type: "HTTP_REQUEST_FAILURE", id, error };
};
