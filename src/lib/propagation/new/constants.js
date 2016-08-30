// Types:
//
// Simulation Node:
// {
//   id: String,
//   type: oneof(NODE_TYPES),
//   expression: null if type === STYPE.data, else user expression.
//   samples: [...],
//   errors: [...],
// }
//
// Global:
// {
//   id: String,
//   samples: [...],
// }
//
// DAG: [
//   ...height 0 nodes: [{...simulation node, inputs: [...input node ids], children: [...indices of children w/in DAG]}],
//   ...height 1 nodes,
//   ...
// ]


export const NODE_TYPES = {
  UNSET: 0, // For safety; should not be used.
  DATA: 1,
  FUNCTION: 2,
  USER_INPUT: 3,
}

export const ERROR_TYPES = {
  GRAPH_ERROR: 0,
}
export const ERROR_SUBTYPES = {
  GRAPH_SUBTYPES: {
    MISSING_INPUT_ERROR: 0,
    IN_INFINITE_LOOP: 1,
    INVALID_ANCESTOR_ERROR: 2,
  },
}
