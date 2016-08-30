import * as NodeFns from './simulationNodeFns'
import * as constants from './constants'

import {Guesstimator} from 'lib/guesstimator/index'
import {_matchingFormatter} from 'lib/guesstimator/formatter/index'

import * as _collections from 'gEngine/collections'

const {
  nodeTypeToGuesstimateType,
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
    const withFunctions = withRelatives.map((n,i) => ({
      ...n,
      index: i,
      getInputs: this._getInputsFor.bind(this, i),
      addErrorToDescendants: this._addErrorToDescendants.bind(this, i),
      parse: () => {
        const e = {text: n.expression, guesstimateType: nodeTypeToGuesstimateType(n.type), data: n.type === NODE_TYPES.DATA ? n.samples : []}
        const formatter = _matchingFormatter(e)
        return [formatter.error(e), formatter.format(e)]
      },
      simulate: this._simulateNode.bind(this, i),
    }))

    this.nodes = withFunctions
    this.errorNodes = errorNodes

    window.recorder.recordSimulationDAGConstructionStop(this)
  }

  find(id) { return _collections.get(this.nodes, id) }
  subsetFrom(idSet) { return this.nodes.filter(n => idSet.includes(n.id) || _.some(idSet, id => n.ancestors.includes(id))) }
  strictSubsetFrom(idSet) { return this.nodes.filter(n => _.some(idSet, id => n.ancestors.includes(id))) }

  _getInputsFor(i) {
    let node = this.nodes[i]
    const inputs = node.parents.map(parentIdx => this.nodes[parentIdx])
    return _.transform(inputs, (map, node) => {map[node.id] = node.samples}, {})
  }

  _addErrorToDescendants(i) {
    let node = this.nodes[i]
    this.subsetFrom([node.id]).forEach(n => {
      let ancestorError = _collections.get(n.errors, INVALID_ANCESTOR_ERROR, 'subType')
      if (!!ancestorError) {
        ancestorError.ancestors = _.uniq([...ancestorError.ancestors, node.id])
      } else {
        n.errors.push({type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [node.id]})
      }
    })
  }

  _simulateNode(i, n) {
    let node = this.nodes[i]
    if (!_.isEmpty(node.errors)) { return Promise.resolve(_.pick(node, ['samples', 'errors'])) }

    // TODO(matthew): We need to have these lines here, within a function that references node via index, so the
    // indicies are stored.
    window.recorder.recordNodeParseStart(node)
    const [parsedError, parsedInput] = node.parse()
    window.recorder.recordNodeParseStop(node, [parsedError, parsedInput])

    window.recorder.recordNodeGetInputsStart(node)
    const inputs = node.getInputs()
    window.recorder.recordNodeGetInputsStop(node, inputs)

    window.recorder.recordNodeSampleStart(node)
    const gtr = new Guesstimator({parsedError, parsedInput}, [...(node.recordingIndices || []), node.sampleRecordingIndex])
    return gtr.sample(n, inputs).then(simulation => {
      window.recorder.recordNodeSampleStop(node)
      node.samples = simulation.values
      if (!_.isEmpty(simulation.errors)) {
        node.errors.push(...simulation.errors)
        node.addErrorToDescendants()
      }
      return _.pick(node, ['samples', 'errors'])
    })
  }
}
