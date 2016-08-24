
const STYPES = {
  DATA: 0,
  FUNCTION: 1,
  USER_INPUT: 2,
}

//
// Simulation Node:
// {
//   id: String,
//   type: oneof(STYPES),
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

export function Simulate(nodes, globals, options) {
  const jobs = jobsList(nodes, options)
}
