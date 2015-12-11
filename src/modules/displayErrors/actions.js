export function newError(error, message) {
  return { type: 'NEW_DISPLAY_ERROR', value: {error, message}};
}

export function close() {
  return { type: 'CLOSE_DISPLAY_ERRORS' };
}
