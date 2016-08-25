
export const STYPES = {
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

const ID_REGEX = /\$\{([^\}]*)\}/g
function withInputsFn({expression}) {
  if (!expression || _.isEmpty(expression)) { return [] }

  let inputs = []
  while (match = ID_REGEX.exec(expression)) { inputs.push(match[1]) }
  return inputs
}

export function Simulate(nodes, globals, options) {
  const jobs = jobsList(nodes.map(withInputsFn, options)
}
