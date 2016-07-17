import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {fetchById} from 'gModules/spaces/actions'
import {create} from 'gModules/calculators/actions'
import {CalculatorNew} from './CalculatorNew.js'
import {swap, incrementItemPosition, relationshipType} from './helpers.js'
import {INTERMEDIATE, OUTPUT, INPUT, NOEDGE} from './helpers.js'

import '../shared/style.css'

import {EditorState, Editor, ContentState} from 'draft-js'
function isCalculatorAcceptableMetric(metric) {
  return (!_.isEmpty(metric.name) && !_.isEmpty(_.get(metric, 'guesstimate.input')))
}

@connect(null, dispatch => bindActionCreators({create, fetchById}, dispatch))
export class CalculatorNewContainer extends Component {
  state = {
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

  componentWillMount() { this.setup(this.props.space) }

  componentWillReceiveProps(newProps) {
    this.setup(newProps.space)
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
    const validOutputs = validMetrics.filter(m => relationshipType(m.edges) === OUTPUT || relationshipType(m.edges) === INTERMEDIATE)
    return {validInputs, validOutputs}
  }

  _onCreate() {
    const calculator = this.state.calculator
    this.props.create(this.props.space.id, {calculator})
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
    this._changeCalculator(change)
  }

  _changeCalculator(fields){
    const {calculator} = this.state
    this.setState({
      calculator: {
        ...calculator,
        ...fields
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

  _onChangeName(e){
    this._changeCalculator({title: e.target.value})
  }

  _onChangeContent(e){
    this._changeCalculator({content: e.target.value})
  }

  _isValid(){
    const {calculator} = this.state
    const hasTitle = !_.isEmpty(calculator.title)
    const hasInputs = !_.isEmpty(calculator.input_ids)
    const hasOutputs = !_.isEmpty(calculator.output_ids)
    return hasTitle && hasInputs && hasOutputs
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
        onChangeName={this._onChangeName.bind(this)}
        onChangeContent={this._onChangeContent.bind(this)}
        onSubmit={this._onCreate.bind(this)}
        isValid={this._isValid()}
      />
    )
  }
}

