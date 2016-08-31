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

export class SimulationNode {
  constructor({id, expression, type, guesstimateType, samples, errors, childrenIndices, parentIndices, ancestors}, DAG, index) {
    this.id = id
    this.expression = expression
    this.type = type
    this.guesstimateType = guesstimateType
    this.samples = samples
    this.errors = errors
    this.parentIndices = parentIndices
    this.childrenIndices = childrenIndices
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
    if (!!_.get(window, 'recorder')) { window.recorder.recordNodeGetInputsStart(this) }
    const inputNodes = this.parentIndices.map(parentIdx => this.DAG.nodes[parentIdx])
    const inputMap = _.transform(inputNodes, (map, node) => {map[node.id] = node.samples}, {})
    if (!!_.get(window, 'recorder')) { window.recorder.recordNodeGetInputsStop(this, inputMap) }
    return inputMap
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
    if (this.hasInputErrors()) { return Promise.resolve(this.getResults()) }

    const [parsedError, parsedInput] = this.parse()

    const inputs = this.getInputs()

    if (!!_.get(window, 'recorder')) { window.recorder.recordNodeSampleStart(this) }
    const gtr = new Guesstimator({parsedError, parsedInput})
    return gtr.sample(numSamples, inputs).then(({values, errors}) => {
      if (!!_.get(window, 'recorder')) { window.recorder.recordNodeSampleStop(this) }

      this.samples = _utils.orArr(values)
      this.errors = _utils.orArr(errors)
      if (!_.isEmpty(errors)) { this.addErrorToDescendants() }
      return this.getResults()
    })
  }
}
