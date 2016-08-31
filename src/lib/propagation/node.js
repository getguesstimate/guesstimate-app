import * as constants from './constants'

const {
  NODE_TYPES,
  nodeTypeToGuesstimateType,
  ERROR_TYPES: {GRAPH_ERROR},
  ERROR_SUBTYPES: {GRAPH_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR}},
} = constants

import {Guesstimator} from 'lib/guesstimator/index'
import {_matchingFormatter} from 'lib/guesstimator/formatter/index'

import * as _collections from 'gEngine/collections'
import * as _utils from 'gEngine/utils'

// Types:
//
// Simulation Node:
// {
//   id: String,
//   type: oneof(NODE_TYPES),
//   expression: null if type === STYPE.data, else user expression.
//   samples: [...],
//   errors: [...],
// }

export class SimulationNode {
  constructor({id, expression, type, guesstimateType, samples, errors, parentIndices, ancestors}, DAG, index) {
    this.id = id
    this.expression = expression
    this.type = type
    this.guesstimateType = guesstimateType
    this.samples = samples
    this.errors = errors
    this.parentIndices = parentIndices
    this.ancestors = ancestors
    this.DAG = DAG
    this.index = index
  }

  data() { return this.type === NODE_TYPES.DATA ? this.samples : [] }

  parse() {
    const e = { text: this.expression, guesstimateType: this.guesstimateType, data: this.data() }
    const formatter = _matchingFormatter(e)
    return [formatter.error(e), formatter.format(e)]
  }

  getInputs() {
    const inputs = this.parentIndices.map(parentIdx => this.DAG.nodes[parentIdx])
    return _.transform(inputs, (map, node) => {map[node.id] = node.samples}, {})
  }

  getDescendants() { return this.DAG.strictSubsetFrom([this.id]) }
  addErrorToDescendants() {
    this.getDescendants().forEach(n => {
      let ancestorError = _collections.get(n.errors, INVALID_ANCESTOR_ERROR, 'subType')
      if (!!ancestorError) {
        ancestorError.ancestors = _.uniq([...ancestorError.ancestors, this.id])
      } else {
        n.errors.push({type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [this.id]})
      }
    })
  }

  hasInputErrors() { return _collections.some(this.errors, INVALID_ANCESTOR_ERROR, 'subType') }
  getResults() { return _.pick(this, ['samples', 'errors']) }
  simulate(numSamples) {
    if (this.hasInputErrors()) { console.log('prematurely resolving'); return Promise.resolve(this.getResults()) }

    window.recorder.recordNodeParseStart(this)
    const [parsedError, parsedInput] = this.parse()
    console.log([parsedError, parsedInput])
    window.recorder.recordNodeParseStop(this, [parsedError, parsedInput])

    window.recorder.recordNodeGetInputsStart(this)
    const inputs = this.getInputs()
    console.log(inputs)
    window.recorder.recordNodeGetInputsStop(this, inputs)

    window.recorder.recordNodeSampleStart(this)
    const gtr = new Guesstimator({parsedError, parsedInput}, [...(this.recordingIndices || []), this.sampleRecordingIndex])
    return gtr.sample(numSamples, inputs).then(simulation => {
      window.recorder.recordNodeSampleStop(this)
      this.samples = _utils.orArr(simulation.values)
      this.errors = _utils.orArr(simulation.errors)
      if (!_.isEmpty(simulation.errors)) {
        this.errors.push(...simulation.errors)
        this.addErrorToDescendants()
      }
      return this.getResults()
    })
  }
}
