export const NODE_TYPES = {
  UNSET: 0, // For safety; should not be used.
  DATA: 1,
  FUNCTION: 2,
  USER_INPUT: 3,
}

export const ERROR_TYPES = {
  UNSET: 0, // For safety; should not be used.
  GRAPH_ERROR: 1,
}
export const ERROR_SUBTYPES = {
  GRAPH_SUBTYPES: {
    UNSET: 0, // For safety; should not be used.
    MISSING_INPUT_ERROR: 1,
    IN_INFINITE_LOOP: 2,
    INVALID_ANCESTOR_ERROR: 3,
  },
}
