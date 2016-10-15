import {NODE_TYPES} from './constants.js'
import * as errorTypes from './errors'

import {Guesstimator} from 'lib/guesstimator/index'
import {_matchingFormatter} from 'lib/guesstimator/formatter/index'

import * as _collections from 'gEngine/collections'
import * as _utils from 'gEngine/utils'


const {
  ERROR_TYPES: {GRAPH_ERROR, PARSER_ERROR},
  ERROR_SUBTYPES: {GRAPH_ERROR_SUBTYPES: {INVALID_ANCESTOR_ERROR}},
} = errorTypes

export class SimulationNode {
  constructor({id, expression, type, guesstimateType, samples, errors, inputs, inputIndices, skipSimulating}, DAG, index) {
    this.id = id
    this.expression = expression
    this.type = type
    this.guesstimateType = guesstimateType
    this.samples = _utils.orArr(samples)
    this.errors = _utils.orArr(errors)
    this.inputIndices = _utils.orArr(inputIndices)
    this.DAG = DAG
    this.index = index
    this.skipSimulating = skipSimulating
    this.inputs = _utils.orArr(inputs)
  }

  simulate(numSamples) {
    const startedWithErrors = this._hasErrors()

    const [parsedError, parsedInput] = this._parse()
    if (this._hasParserError() && _.isEmpty(parsedError)) {
      this.errors = this.errors.filter(e => e.type !== PARSER_ERROR)
    }

    if (this._hasGraphErrors()) {
      // Now, we'll clear all non-parser or -graph errors as we can't be confident that they still apply.
      this.errors = this.errors.filter(e => [PARSER_ERROR, GRAPH_ERROR].includes(e.type))
      return Promise.resolve(this._getSimulationResults())
    }

    const inputs = this._getInputs()

    if (!!_.get(window, 'recorder')) { window.recorder.recordNodeSampleStart(this) }
    const guesstimator = new Guesstimator({parsedError, parsedInput})
    return guesstimator.sample(numSamples, inputs).then(({values, errors}) => {
      if (!!_.get(window, 'recorder')) { window.recorder.recordNodeSampleStop(this) }

      this.samples = _utils.orArr(values)
      this.errors = _utils.orArr(errors)

      if (this._hasErrors() && !startedWithErrors) { this._addErrorToDescendants() }
      if (!this._hasErrors() && startedWithErrors) { this._clearErrorFromDescendants() }

      return this._getSimulationResults()
    })
  }

  _data() { return this.type === NODE_TYPES.DATA ? this.samples : [] }
  _parse() {
    const guesstimatorInput = { text: this.expression, guesstimateType: this.guesstimateType, data: this._data() }
    const formatter = _matchingFormatter(guesstimatorInput)
    return [formatter.error(guesstimatorInput), formatter.format(guesstimatorInput)]
  }

  _getDescendants() { return this.DAG.strictSubsetFrom([this.id]) }
  _addErrorToDescendants() {
    this._getDescendants().forEach(n => {

      const dataProp = n.inputs.includes(this.id) ? 'inputs' : 'ancestors'
      if (_collections.some(n.errors, INVALID_ANCESTOR_ERROR, 'subType')) {
        let ancestorError = _collections.get(n.errors, INVALID_ANCESTOR_ERROR, 'subType')
        _.set(ancestorError, dataProp,  _.uniq([..._.get(ancestorError, dataProp), this.id]))
      } else {
        let error = {type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, inputs: [], ancestors: []}
        error[dataProp] = [this.id]
        n.errors.push(error)
      }
    })
  }
  _clearErrorFromDescendants() {
    this._getDescendants().forEach(n => {
      let ancestorError = _collections.get(n.errors, INVALID_ANCESTOR_ERROR, 'subType')
      if (!ancestorError) { return }

      ancestorError.ancestors = _.filter(ancestorError.ancestors, e => e !== this.id)
      ancestorError.inputs = _.filter(ancestorError.inputs, e => e !== this.id)

      if (_.isEmpty(ancestorError.ancestors) && _.isEmpty(ancestorError.inputs)) {
        n.errors = _.filter(n.errors, e => e.subType !== INVALID_ANCESTOR_ERROR)
      }
    })
  }

  _getInputs() {
    if (!!_.get(window, 'recorder')) { window.recorder.recordNodeGetInputsStart(this) }
    const inputNodes = this.inputIndices.map(inputIdx => this.DAG.nodes[inputIdx])
    const inputMap = _.transform(inputNodes, (map, node) => {map[node.id] = node.samples}, {})
    if (!!_.get(window, 'recorder')) { window.recorder.recordNodeGetInputsStop(this, inputMap) }
    return inputMap
  }

  _hasErrors() { return !_.isEmpty(this.errors) }
  _hasParserError() { return _collections.some(this.errors, PARSER_ERROR, 'type') }
  _hasGraphErrors() { return _collections.some(this.errors, GRAPH_ERROR, 'type') }
  _getSimulationResults() { return _.pick(this, ['samples', 'errors']) }
}
