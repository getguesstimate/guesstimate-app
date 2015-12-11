export function newError(error, message) {
  const value = {error, message}
  return { type: 'NEW_DISPLAY_ERROR', value };
}

export function close() {
  return { type: 'CLOSE_DISPLAY_ERRORS' };
}
