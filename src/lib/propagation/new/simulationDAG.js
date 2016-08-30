import * as NodeFns from './simulationNodeFns'
import {SimulationNode} from './node'
import * as constants from './constants'

import * as _collections from 'gEngine/collections'

const {
  NODE_TYPES,
  ERROR_TYPES: {GRAPH_ERROR},
  ERROR_SUBTYPES: {GRAPH_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR}},
} = constants

export class SimulationDAG {
  constructor(nodes) {
    window.recorder.recordSimulationDAGConstructionStart(this)
    let rest = nodes.map(NodeFns.extractInputs)

    let byId = _.transform(rest, (map, node) => {map[node.id] = {node, lastAncestors: node.inputs, ancestors: node.inputs}}, {})

    const missingInputsNodes = _.remove(rest, NodeFns.hasMissingInputs(rest))
    let errorNodes = missingInputsNodes.map(NodeFns.withMissingInputError(nodes))
    let heightOrderedNodes = []

    while (!_.isEmpty(rest)) {
      const nextLevelNodes = _.remove(rest, NodeFns.allInputsWithin(heightOrderedNodes))
      heightOrderedNodes.push(...nextLevelNodes)

      const infiniteLoopNodes = _.remove(rest, n => _.some(byId[n.id].lastAncestors, id => id === n.id))
      const withInfiniteLoopErrors = infiniteLoopNodes.map(NodeFns.withInfiniteLoopError)
      errorNodes.push(...withInfiniteLoopErrors)

      const inputErrorNodes = _.remove(
        rest,
        _collections.andFns(NodeFns.anyInputsWithin(errorNodes), NodeFns.allInputsWithin([...heightOrderedNodes, ...errorNodes]))
      )
      const withAncestralErrors = inputErrorNodes.map(NodeFns.withAncestralError(errorNodes))
      errorNodes.push(...withAncestralErrors)

      rest.forEach(n => {
        const newLastAncestors = _.uniq(_.flatten(byId[n.id].lastAncestors.map(a => byId[a].node.inputs)))

        byId[n.id].lastAncestors = newLastAncestors
        byId[n.id].ancestors = _.uniq([...byId[n.id].ancestors, ...newLastAncestors])
      })
    }

    const withRelatives = heightOrderedNodes.map(NodeFns.withRelatives(heightOrderedNodes, byId))
    const asNodes = withRelatives.map((n,i) => new SimulationNode(n, this, i))

    this.nodes = asNodes
    this.errorNodes = errorNodes

    window.recorder.recordSimulationDAGConstructionStop(this)
  }

  find(id) { return _collections.get(this.nodes, id) }
  subsetFrom(idSet) { return this.nodes.filter(n => idSet.includes(n.id) || _.some(idSet, id => n.ancestors.includes(id))) }
  strictSubsetFrom(idSet) { return this.nodes.filter(n => _.some(idSet, id => n.ancestors.includes(id))) }
}
