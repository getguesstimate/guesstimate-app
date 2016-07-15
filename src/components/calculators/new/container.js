import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {newCalculatorSelector} from './new-calculator-selector'

import {fetchById} from 'gModules/spaces/actions'
import {create} from 'gModules/calculators/actions'
import {CalculatorNew} from './CalculatorNew.js'

import '../shared/style.css'
import './style.css'

import {EditorState, Editor, ContentState} from 'draft-js'
function isCalculatorAcceptableMetric(metric) {
  return (!_.isEmpty(metric.name) && !_.isEmpty(_.get(metric, 'guesstimate.input')))
}

const relationshipType = (edges) => {
  if (edges.inputs.length && edges.outputs.length) { return INTERMEDIATE }
  if (edges.inputs.length) { return OUTPUT }
  if (edges.outputs.length) { return INPUT }
  return NOEDGE
}

const INTERMEDIATE = 'INTERMEDIATE'
const OUTPUT = 'OUTPUT'
const INPUT = 'INPUT'
const NOEDGE = 'NOEDGE'

function swap(array, index1, index2){
  const firstElement = array[index1]
  const secondElement = array[index2]
  let newArray = _.clone(array)
  newArray[index1] = secondElement
  newArray[index2] = firstElement
  return newArray
}

function incrementItemPosition(array, elementName, positiveDirection){
  const index = _.indexOf(array, elementName)
  let nextIndex
  if (positiveDirection) {
    if (index === array.length - 1) { return array }
    nextIndex = index + 1
    const newArray = swap(array, index, nextIndex)
    return newArray
  }
  if (!positiveDirection) {
    if (index === 0) { return array }
    nextIndex = index - 1
    const newArray = swap(array, index, nextIndex)
    return newArray
  }
}

@connect(newCalculatorSelector, dispatch => bindActionCreators({create, fetchById}, dispatch))
export class CalculatorNewContainer extends Component {
  state = {
    attemptedFetch: false,
    setupNewCalculator: false,
    validInputs: [],
    validOutputs: [],
    calculator: {
      title: null,
      content: null,
      input_ids: [],
      output_ids: []
    }
  }

  componentWillMount() { this.fetchData() }

  componentWillReceiveProps(newProps) {
    this.fetchData()
    this.setup(newProps.space)
  }

  fetchData() {
    if (!this.state.attemptedFetch) {
      this.props.fetchById(this.props.space_id)
      this.setState({attemptedFetch: true})
    }
  }

  setup(space){
    if (!!space.id){
      const {validInputs, validOutputs} = this.validMetrics(space.metrics)

      if(!this.state.setupNewCalculator){
        const calculator = {
           title: space.name || "",
           content: space.description || "",
           input_ids: validInputs.map(e => e.id),
           output_ids: validOutputs.map(e => e.id)
        }
        this.setState({calculator, validInputs, validOutputs, setupNewCalculator: true})
      }

      else {
        this.setState({validInputs, validOutputs})
      }
    }
  }

  validMetrics(metrics) {
    const validMetrics = metrics.filter(m => isCalculatorAcceptableMetric)
    const validInputs = validMetrics.filter(m => relationshipType(m.edges) === INPUT)
    const validOutputs = validMetrics.filter(m => relationshipType(m.edges) === OUTPUT)
    return {validInputs, validOutputs}
  }

  _onCreate() {
    const calculator = this.state.calculator
    this.props.create(this.props.space_id, {calculator})
  }

  _onMetricHide(id){
    const {calculator} = this.state
    this.setState({
      calculator: {
        ...calculator,
        input_ids: calculator.input_ids.filter(m => m !== id),
        output_ids: calculator.output_ids.filter(m => m !== id),
      }
    })
  }

  _onMetricShow(id){
    const {calculator} = this.state
    let {input_ids, output_ids} = calculator

    let new_input_ids, new_output_ids
    if (this._isInput(id)) {
      new_input_ids = [...input_ids, id]
      new_output_ids = output_ids
    } else {
      new_output_ids = [...output_ids, id]
      new_input_ids = input_ids
    }

    this.setState({
      calculator: {
        ...calculator,
        input_ids: new_input_ids,
        output_ids: new_output_ids
      }
    })
  }

  _isInput(id){
    return _.some(this.state.validInputs, e => e.id === id)
  }

  _onMoveMetric(id, isDown){
    const {calculator} = this.state
    let {input_ids, output_ids} = calculator
    let change = (this._isInput(id)) ? {input_ids: incrementItemPosition(input_ids, id, isDown)} : {output_ids: incrementItemPosition(output_ids, id, isDown)}

    this.setState({
      calculator: {
        ...calculator,
        ...change
      }
    })
  }

  _onMoveMetricUp(id){this._onMoveMetric(id, false)}
  _onMoveMetricDown(id){this._onMoveMetric(id, true)}

  _isVisible(metricId) {
    const {calculator} = this.state
    let {input_ids, output_ids} = calculator
    return _.some([...input_ids, ...output_ids], e => metricId === e)
  }

  _orderDisplayedMetrics(metric_ids, validMetrics){
    return [
      ...metric_ids.map(i => validMetrics.find(m => m.id === i)),
      ...validMetrics.filter(i => !this._isVisible(i.id))
    ].map(e => {return {metric: e, isVisible: this._isVisible(e.id)}})
  }

  render() {
    const {validInputs, validOutputs, calculator} = this.state
    const inputs = this._orderDisplayedMetrics(calculator.input_ids, validInputs)
    const outputs = this._orderDisplayedMetrics(calculator.output_ids, validOutputs)

    if (!this.state.setupNewCalculator){ return (false) }
    return (
      <CalculatorNew
        calculator={calculator}
        inputs={inputs}
        outputs={outputs}
        onMetricHide={this._onMetricHide.bind(this)}
        onMetricShow={this._onMetricShow.bind(this)}
        onMoveMetricUp={this._onMoveMetricUp.bind(this)}
        onMoveMetricDown={this._onMoveMetricDown.bind(this)}
        onSubmit={this._onCreate.bind(this)}
      />
    )
  }
}

