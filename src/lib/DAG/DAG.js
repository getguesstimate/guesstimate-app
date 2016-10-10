import {orFns} from 'gEngine/collections'
import {typeSafeEq, mutableCopy, orArr} from 'gEngine/utils'
import * as errorTypes from 'lib/propagation/errors'

const matchesId = testId => n => !!n.isCycle ? _.some(n.nodes, ({id}) => typeSafeEq(testId, id)) : typeSafeEq(testId, n.id)
export const idMatchesSome = nodeSet => id => _.some(nodeSet, matchesId(id))

const notIn = list => e => !list.includes(e)
const allInputsWithin = (nodeSet, ignoreSet = []) => n => _.every(n.inputs.filter(notIn(ignoreSet)), idMatchesSome(nodeSet))

export const getMissingInputs = nodeSet => _.uniq(_.flatten(nodeSet.map(n => n.inputs))).filter(_.negate(idMatchesSome(nodeSet)))

// Ignores missing inputs.
export function separateIntoHeightSets(nodes) {
  const missingInputs = getMissingInputs(nodes)
  let unprocessedNodes = mutableCopy(nodes)
  let heightOrderedNodes = []
  while (!_.isEmpty(unprocessedNodes)) {
    const nextLevelNodes = _.remove(unprocessedNodes, allInputsWithin(_.flatten(heightOrderedNodes), missingInputs))
    if (_.isEmpty(nextLevelNodes)) { console.warn('INFINITE LOOP DETECTED'); break }
    heightOrderedNodes.push(nextLevelNodes)
  }
  return heightOrderedNodes
}

const isRelatedToFn = ({id}, ancestors) => n => ancestors[id].includes(n.id) || ancestors[n.id].includes(id)
const anyRelationsWithin = (nodeSet, ancestors) => orFns(...nodeSet.map(n => isRelatedToFn(n, ancestors)))
export function separateIntoDisconnectedComponents(nodes, ancestors) {
  if (_.isEmpty(nodes)) { return [] }
  let unprocessedNodes = mutableCopy(nodes)
  let components = []
  let currentComponent = []
  while (!_.isEmpty(unprocessedNodes)) {
    let newComponentNodes = _.pullAt(unprocessedNodes, [0])
    do {
      currentComponent.push(...newComponentNodes)
      newComponentNodes = _.remove(unprocessedNodes, anyRelationsWithin(currentComponent, ancestors))
    } while (!_.isEmpty(newComponentNodes))

    components.push(currentComponent)
    currentComponent = []
  }
  return components
}

const nextLevelAncestors = (curr, total, key) => _.flatten(curr.map(a => orArr(total[a]))).filter(a => !total[key].includes(a))
const getNewAncestorsFn = ancestors => (res, value, key) => {res[key] = nextLevelAncestors(value, ancestors, key)}
export function getAncestors(nodes) {
  const inputsById = _.transform(nodes, (res, {id, inputs}) => {res[id] = inputs}, {})
  let unprocessedNodes = mutableCopy(nodes)

  let newAncestors = mutableCopy(inputsById, true)
  let ancestors = _.transform(nodes, (res, {id}) => {res[id] = []}, {})

  while (!_.isEmpty(newAncestors)) {
    _.forEach(newAncestors, (newAncestors, id) => {ancestors[id].push(...newAncestors)})
    newAncestors = _.omitBy(_.transform(newAncestors, getNewAncestorsFn(ancestors), {}), _.isEmpty)
  }

  return ancestors
}

const inACycleWithNodeFn = ({id}, ancestors) => n => ancestors[id].includes(n.id) && ancestors[n.id].includes(id)
export function getCycleSets(nodes, ancestors) {
  let acyclicNodes = mutableCopy(nodes)
  let cycleSets = []

  let cycleNodes = _.remove(acyclicNodes, ({id}) => ancestors[id].includes(id))

  while (!_.isEmpty(cycleNodes)) {
    cycleSets.push(_.remove(cycleNodes, inACycleWithNodeFn(cycleNodes[0], ancestors)))
  }

  return {acyclicNodes, cycleSets}
}

export function toCyclePseudoNode(nodes) {
  const containedIds = nodes.map(n => n.id)
  return {
    id: null,
    isCycle: true,
    inputs: _.uniq(_.flatten(nodes.map(n => orArr(n.inputs).filter(notIn(containedIds))))),
    dependants: _.uniq(_.flatten(nodes.map(n => orArr(n.dependants).filter(notIn(containedIds))))),
    nodes,
  }
}
