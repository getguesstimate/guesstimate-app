import * as NodeFns from './nodeFns'
import {SimulationNode} from './node'
import * as constants from './constants'

import * as _collections from 'gEngine/collections'

export class SimulationDAG {
  constructor(nodes) {
    if (!!_.get(window, 'recorder')) { window.recorder.recordSimulationDAGConstructionStart(this) }
    let rest = nodes.map(NodeFns.extractInputs)

    let byId = _.transform(rest, (map, node) => {map[node.id] = {node, lastAncestors: node.inputs, ancestors: node.inputs}}, {})

    const missingInputsNodes = _.remove(rest, NodeFns.hasMissingInputs(rest))
    let graphErrorNodes = missingInputsNodes.map(NodeFns.withMissingInputError(nodes))
    let errorNodes = Object.assign([], graphErrorNodes)
    let heightOrderedNodes = []

    while (!_.isEmpty(rest)) {
      const nextLevelNodes = _.remove(
        rest,
        n => NodeFns.allInputsWithin(heightOrderedNodes)(n) && _.isEmpty(n.errors) && !NodeFns.anyInputsWithin(errorNodes)(n)
      )
      heightOrderedNodes.push(...nextLevelNodes)

      const incomingErrorNodes = _.remove(rest, n => !_.isEmpty(n.errors) && NodeFns.allInputsWithin(heightOrderedNodes)(n))
      errorNodes.push(...incomingErrorNodes)
      heightOrderedNodes.push(...incomingErrorNodes) // We may want to resimulate these later anyways...

      const infiniteLoopNodes = _.remove(rest, n => _.some(byId[n.id].lastAncestors, id => id === n.id))
      const withInfiniteLoopErrors = infiniteLoopNodes.map(NodeFns.withInfiniteLoopError)
      errorNodes.push(...withInfiniteLoopErrors)
      graphErrorNodes.push(...withInfiniteLoopErrors)

      const inputErrorNodes = _.remove(
        rest,
        _collections.andFns(NodeFns.anyInputsWithin(errorNodes), NodeFns.allInputsWithin([...heightOrderedNodes, ...errorNodes]))
      )
      const withAncestralErrors = inputErrorNodes.map(NodeFns.withAncestralError(errorNodes))
      errorNodes.push(...withAncestralErrors)
      graphErrorNodes.push(...withAncestralErrors)

      rest.forEach(n => {
        const newLastAncestors = _.uniq(_.flatten(byId[n.id].lastAncestors.map(a => byId[a].node.inputs)))

        byId[n.id].lastAncestors = newLastAncestors
        byId[n.id].ancestors = _.uniq([...byId[n.id].ancestors, ...newLastAncestors])
      })
    }

    const withRelatives = heightOrderedNodes.map(NodeFns.withRelatives(heightOrderedNodes, byId))
    const asNodes = withRelatives.map((n,i) => new SimulationNode(n, this, i))

    this.nodes = asNodes
    this.graphErrorNodes = graphErrorNodes

    if (!!_.get(window, 'recorder')) { window.recorder.recordSimulationDAGConstructionStop(this) }
  }

  find(id) { return _collections.get(this.nodes, id) }
  subsetFrom(idSet) { return this.nodes.filter(n => idSet.includes(n.id) || _.some(idSet, id => n.ancestors.includes(id))) }
  strictSubsetFrom(idSet) { return this.nodes.filter(n => _.some(idSet, id => n.ancestors.includes(id))) }
}
