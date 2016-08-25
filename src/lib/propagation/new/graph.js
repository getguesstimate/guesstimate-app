//
// DAG: [
//   ...height 0 nodes: [{...simulation node, inputs: [...input node ids], children: [...indices of children w/in DAG]}],
//   ...height 1 nodes,
//   ...
// ]

const GRAPH_ERROR = 'GRAPH_ERROR'
const MISSING_INPUT_ERROR = 'MISSING_INPUT_ERROR'
const IN_INFINITE_LOOP = 'IN_INFINITE_LOOP'
const INVALID_ANCESTOR_ERROR = 'INVALID_ANCESTOR_ERROR'

const indicesOf = (list, predFn) => list.map((e, i) => predFn(e) ? i : null).filter(e => !!e)
const addError = (n, type, subType, data) => ({...n, errors: [...n.errors, {type, subType, ...data}]})
const addGraphError = (n, subType, data={}) => addError(n, GRAPH_ERROR, subType, data)

const addInputError = (n, missingInputs) => _.isEmpty(missingInputs) ? n : addError(n, GRAPH_ERROR, MISSING_INPUT_ERROR, {missingInputs})
const findInvalidInputs = (n, nodes) => _.filter(n.inputs, i => _.every(nodes, ({id}) => id !== i))
const withInputErrorFn = nodes => n => addInputError(n, findInvalidInputs(n, nodes))

const anyInputsWithinFn = inputNodeSet => n => _.some(n.inputs, i => _.some(inputNodeSet, ({id}) => id === i))
const allInputsWithinFn = inputNodeSet => n => _.every(n.inputs, i => _.some(inputNodeSet, ({id}) => id === i))

const withInfiniteLoopErrorFn = n => addGraphError(n, IN_INFINITE_LOOP)

const getChildren = (n, nodes) => indicesOf(nodes, n2 => _.some(n2.inputs, i => n.id === i))
const getParents = (n, nodes) => indicesOf(nodes, n2 => _.some(n.inputs, i => n2.id === i))
const withRelativesFn = nodes => n => ({...n, children: getChildren(n, nodes), parents: getParents(n, nodes)})

const hasAncestralErrorFn = errorNodes => n => _.some(n.inputs, i => _.some(errorNodes, ({id}) => id === i))
const concatErrorIds = (running, curr) => curr.subType === INVALID_ANCESTOR_ERROR ? [...running, ...curr.ancestors] : [...running, a]
const getInvalidAncestors = (n, errorNodes) => _.uniq(_.flatten(
  n.inputs.map(i => (_.get(errorNodes.find(({id}) => id === i), 'errors') || []).reduce(concatErrorIds, []))
))
const withAncestralErrorFn = errorNodes => n => addGraphError(n, INVALID_ANCESTOR_ERROR, {ancestors: getInvalidAncestors(n, errorNodes)})

function toDAGi(rawRunningNodes = [], rawErrorNodes = []) {
  const IdMapEntry = node => ({node, ancestors: [node.inputs]})
  let byId = _.transform([...rawRunningNodes, ...rawErrorNodes], (res, n) => {res[n.id] = IdMapEntry(n)}, {})

  let heightOrderedNodes = []
  let errorNodes = Object.assign([], rawErrorNodes)
  let rest = Object.assign([], rawRunningNodes)

  while (!_.isEmpty(rest)) {
    const nextLevelNodes = _.remove(rest, allInputsWithinFn(heightOrderedNodes))
    heightOrderedNodes.push(...nextLevelNodes)

    const inputErrorNodes = _.remove(rest, hasAncestralErrorFn(errorNodes))
    const withAncestralErrors = inputErrorNodes.map(withAncestralErrorFn(errorNodes))

    const infiniteLoopNodes = _.remove(rest, n => _.some(_.last(byId[n.id].ancestors), ({id}) => id === n.id))
    const withInfiniteLoopErrors = infiniteLoopNodes.map(withInfiniteLoopErrorFn)

    errorNodes.push(...withAncestralErrors, ...withInfiniteLoopErrors)

    rest.forEach(n => {
      const oldAncestors = byId[n.id].ancestors
      byId[n.id].ancestors.push(_.uniq(_.flatten(_.last(oldAncestors).map(a => byId[a].inputs))))
    })
  }

  return {heightOrderedNodes, errorNodes}
}

export function toDAG(nodes) {
  let [runningNodes, errorNodes] = [[], []]

  runningNodes = nodes.map(withInputErrorFn(nodes))
  errorNodes = _.remove(runningNodes, n => !_.isEmpty(n.errors))

  const {heightOrderedNodes, errorNodes} = toDAGi(runningNodes, errorNodes)

  const DAG = dependencyOrderedNodes.map(withRelativesFn(dependencyOrderedNodes))
  return {DAG, errorNodes}
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
