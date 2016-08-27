import * as NodeFns from './simulationNodeFns'
import * as constants from './constants'

import {Guesstimator} from '../guesstimator/index'

import * as _collections from 'gEngine/collections'

const {
  ERROR_TYPES: {GRAPH_ERROR},
  ERROR_SUBTYPES: {GRAPH_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR}},
} = constants

export class SimulationDAG {
  constructor(nodes) {
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
    const withFunctions = withRelatives.map((n,i) => ({
      ...n,
      index: i,
      getInputs: this._getInputsFor.bind(this, n),
      addErrorToDescendants: this._addErrorToDescendants.bind(this, n),
      simulate: this._simulateNode.bind(this, n),
    }))

    this.nodes = withFunctions
    this.errorNodes = errorNodes
  }

  find(id) { return _collections.get(this.nodes, id) }
  subsetFrom(idSet) { return this.nodes.filter(n => idSet.includes(n.id) || _.some(idSet, id => n.ancestors.includes(id))) }

  _getInputsFor(node) {
    const inputs = node.parents.map(parentIdx => this.nodes[parentIdx])
    return _.transform(inputs, (map, node) => {map[node.id] = node.samples}, {})
  }

  _addErrorToDescendants(node) {
    this.subsetFrom([node.id]).forEach(n => {
      let ancestorError = _collections.get(n.errors, INVALID_ANCESTOR_ERROR, 'subType')
      if (!!ancestorError) {
        ancestorError.ancestors = _.uniq([...ancestorError.ancestors, node.id])
      } else {
        n.errors.push({type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [node.id]})
      }
    })
  }

  _simulateNode(node, n, globals) {
    const [parseError, parsed] = Guesstimator.parse(guesstimate)
    if (!_.isEmpty(parseError)) {
      node.errors.push(parseError)
      node.addErrorToDescendants()
    }

    if (!_.isEmpty(node.errors)) {
      return Promise.resolve(NodeFns.resolveSamples(node))
    }

    return item.sample(n, node.getInputs()).then(samples => {
      node.samples = samples
      return NodeFns.resolveSamples(node)
    })
  }
}
