export function newError(error?: string, message?: string) {
  const value = { error, message };
  return { type: "NEW_DISPLAY_ERROR" as const, value };
}

export function close() {
  return { type: "CLOSE_DISPLAY_ERRORS" as const };
}

// antipattern, see https://phryneas.de/redux-typescript-no-discriminating-union
export type DisplayErrorAction =
  | ReturnType<typeof newError>
  | ReturnType<typeof close>;
