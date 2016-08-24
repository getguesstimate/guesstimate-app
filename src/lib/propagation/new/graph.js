//
// DAG: [
//   ...height 0 nodes: [{...simulation node, inputs: [...input node ids], children: [...indices of children w/in DAG]}],
//   ...height 1 nodes,
//   ...
// ]

const ID_REGEX = /\$\{([^\}]*)\}/
const GRAPH_ERROR = 'GRAPH_ERROR'
const MISSING_INPUT_ERROR = 'MISSING_INPUT_ERROR'
const IN_INFINITE_LOOP = 'IN_INFINITE_LOOP'
const INVALID_ANCESTOR_ERROR = 'INVALID_ANCESTOR_ERROR'

function extractInputs({expression}) {
  if (!expression || _.isEmpty(expression)) { return [] }

  const re = RegExp(ID_REGEX.source, 'g') // We explicitly re-initialize here with global modifer to avoid infinite loop.
  let inputs = []
  while (match = re.exec(expression)) { inputs.push(match[1]) }
  return inputs
}

const addError = (n, type, subType, data) => ({...n, errors: [...n.errors, {type, subType, ...data}]})

const addInputError = (n, missingInputs) => _.isEmpty(missingInputs) ? n : addError(n, GRAPH_ERROR, MISSING_INPUT_ERROR, {missingInputs})
const findInvalidInputs = (n, nodes) => _.filter(n.inputs, i => _.every(nodes, ({id}) => id !== i))
const withInputErrorFn = nodes => n => addInputError(n, findInvalidInputs(n, nodes))

const allInputsWithinFn = inputNodeSet => n => _.every(n.inputs, i => _.some(inputNodeSet, ({id}) => id === i))

const withInfiniteLoopErrorFn = loopNodes => n => _.isEmpty(loopNodes) ? n : addError(n, GRAPH_ERROR, IN_INFINITE_LOOP, {loopIds: loopNodes.map(n => n.id)})

const indicesOf = (list, predFn) => list.map((e, i) => predFn(e) ? i : null).filter(e => !!e)
const getChildren = (n, nodes) => indicesOf(nodes, n2 => _.some(n2.inputs, i => n.id === i))
const getParents = (n, nodes) => indicesOf(nodes, n2 => _.some(n.inputs, i => n2.id === i))
const withRelativesFn = nodes => n => ({...n, children: getChildren(n, nodes), parents: getParents(n, nodes)})

export function toDAG(rawNodes) {
  const withInputs = rawNodes.map(withInputsFn)
  const withMissingInputErrors = withInputs.map(withInputErrorFn(rawNodes))

  let heightOrderedNodes = []
  let rest = withMissingInputErrors
  while (!_.isEmpty(rest)) {
    const children = _.remove(rest, allInputsWithinFn(heightOrderedNodes))
    if (_.isEmpty(children)) { break }
    heightOrderedNodes.push(...children)
  }

  const dependencyOrderedNodes = [...heightOrderedNodes]
  const infiniteLoopNodes [...rest.map(withInfiniteLoopErrorFn(rest))]

  const DAG = dependencyOrderedNodes.map(withRelativesFn(dependencyOrderedNodes))
  return {DAG, infiniteLoopNodes}
}

// Mutates:
export function addErrorsToChildren(DAG, erroredIndex) {
  const ancestorId = DAG[erroredIndex].id
  let childrenIndices = DAG[erroredIndex].children
  while (!_.isEmpty(childrenIndices)) {
    childrenIndices.forEach(i => DAG[i] = addError(DAG[i], GRAPH_ERROR, INVALID_ANCESTOR_ERROR, {ancestorId}))
    childrenIndices = _.flatten(childrenIndices.map(i => DAG[i].children))
  }
}

// TODO(matthew): Define:
function runJob() {}
const toJob = (DAG, n) => _.isEmpty(n.errors) ? n : null

// Mutates:
export function runChild(DAG, indexToRun) {
  let node = DAG[indexToRun]

  const job = toJob(DAG, n)
  if (!!job) {
    const {samples, errors} = runJob(job)
    node.samples = samples
    node.errors.push(...errors)
  }

  if (!_.isEmpty(node.errors)) {
    addErrorsToChildren(DAG, indexToRun)
  }
}
