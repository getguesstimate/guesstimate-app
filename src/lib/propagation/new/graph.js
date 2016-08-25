import * as NodeFns from './simulationNodeFns'
import * as _utils from 'gEngine/utils'
import {andFns} from 'gEngine/collections'

export function toDAG(nodes) {
  let rest = nodes.map(NodeFns.extractInputs)

  let byId = _.transform(rest, (map, node) => {map[node.id] = {node, ancestors: node.inputs}}, {})

  const missingInputsNodes = _.remove(rest, NodeFns.hasMissingInputs(rest))
  let errorNodes = missingInputsNodes.map(NodeFns.withMissingInputError(nodes))
  let heightOrderedNodes = []

  while (!_.isEmpty(rest)) {
    const nextLevelNodes = _.remove(rest, NodeFns.allInputsWithin(heightOrderedNodes))
    heightOrderedNodes.push(...nextLevelNodes)

    const infiniteLoopNodes = _.remove(rest, n => _.some(byId[n.id].ancestors, id => id === n.id))
    const withInfiniteLoopErrors = infiniteLoopNodes.map(NodeFns.withInfiniteLoopError)
    errorNodes.push(...withInfiniteLoopErrors)

    const inputErrorNodes = _.remove(
      rest,
      andFns(NodeFns.anyInputsWithin(errorNodes), NodeFns.allInputsWithin([...heightOrderedNodes, ...errorNodes]))
    )
    const withAncestralErrors = inputErrorNodes.map(NodeFns.withAncestralError(errorNodes))
    errorNodes.push(...withAncestralErrors)

    rest.forEach(n => {
      const oldAncestors = byId[n.id].ancestors
      byId[n.id].ancestors = _.uniq(_.flatten(oldAncestors.map(a => byId[a].node.inputs)))
    })
  }

  return {DAG: heightOrderedNodes.map(NodeFns.withRelatives(heightOrderedNodes)), errorNodes}
}
