import React, {Component} from 'react'

import {CalculatorForm} from '../shared/CalculatorForm.js'

import {INTERMEDIATE, OUTPUT, INPUT, NOEDGE, relationshipType} from 'gEngine/graph'

import '../style.css'

function isCalculatorAcceptableMetric(metric) {
  return !_.isEmpty(metric.name) && !_.isEmpty(_.get(metric, 'guesstimate.input'))
}

function AddAtIndex(l, e, destIndex) {
  const index = l.findIndex(el => el === e)
  if (index >= destIndex) { return [...l.slice(0, destIndex), e, ...l.slice(destIndex, index), ...l.slice(index+1)] }
  else { return [...l.slice(0, index), ...l.slice(index+1, destIndex+1), e, ...l.slice(destIndex+1)] }
}

export class FormContainer extends Component {
  state = {
    validInputs: [],
    validOutputs: [],
    calculator: {
      title: null,
      content: null,
      input_ids: [],
      output_ids: []
    }
  }

  componentWillMount() { this.setup() }

  setup() {
    const {space} = this.props
    if (!space.id) { return }

    const {validInputs, validOutputs} = this.validMetrics(space.metrics)

    const calculator = this.props.calculator || {
       title: space.name || "",
       space_id: space.id,
       content: space.description || "",
       input_ids: validInputs.map(e => e.id),
       output_ids: validOutputs.map(e => e.id)
    }
    this.setState({calculator, validInputs, validOutputs})
  }

  validMetrics(metrics) {
    const validMetrics = metrics.filter(isCalculatorAcceptableMetric)
    const validInputs = validMetrics.filter(m => relationshipType(m.edges) === INPUT)
    const validOutputs = validMetrics.filter(m => [INTERMEDIATE, OUTPUT].includes(relationshipType(m.edges)))
    return {validInputs, validOutputs}
  }

  _onCreate() { this.props.onSubmit(this.state.calculator) }

  _onMetricHide(id) {
    const {calculator} = this.state
    this.setState({
      calculator: {
        ...calculator,
        input_ids: calculator.input_ids.filter(m => m !== id),
        output_ids: calculator.output_ids.filter(m => m !== id),
      }
    })
  }

  _onMetricShow(id) {
    const {calculator} = this.state
    const {input_ids, output_ids} = calculator

    let changes = {}
    if (this._isInput(id)) {
      changes.input_ids = [...input_ids, id]
    } else {
      changes.output_ids = [...output_ids, id]
    }

    this.setState({ calculator: {...calculator, ...changes} })
  }

  _isInput(id) {
    return _.some(this.state.validInputs, e => e.id === id)
  }

  _onMoveMetricTo(id, destIndex) {
    const {calculator: {input_ids, output_ids}} = this.state
    const AddId = l => AddAtIndex(l, id, destIndex)
    this._changeCalculator(this._isInput(id) ? {input_ids: AddId(input_ids)} : {output_ids: AddId(output_ids)})
  }

  _changeCalculator(fields) {
    const {calculator} = this.state
    this.setState({
      calculator: {
        ...calculator,
        ...fields
      }
    })
  }

  _isVisible(metricId) {
    const {calculator: {input_ids, output_ids}} = this.state
    return _.some([...input_ids, ...output_ids], e => metricId === e)
  }

  _orderDisplayedMetrics(metric_ids, validMetrics) {
    return [
      ...metric_ids.map(i => validMetrics.find(m => m.id === i)).filter(m => !!m),
      ...validMetrics.filter(i => !this._isVisible(i.id))
    ].map(e => {return {metric: e, isVisible: this._isVisible(e.id)}})
  }

  _onChangeName(e) {
    this._changeCalculator({title: e.target.value})
  }

  _onChangeContent(e) {
    this._changeCalculator({content: e.target.value})
  }

  _isValid() {
    const {calculator: {title, input_ids, output_ids}} = this.state
    return !(_.isEmpty(title) || _.isEmpty(input_ids) || _.isEmpty(output_ids))
  }

  render() {
    const {props: {buttonText}, state: {validInputs, validOutputs, calculator}} = this
    if (_.isEmpty(calculator)) { return false }

    const inputs = this._orderDisplayedMetrics(calculator.input_ids, validInputs)
    const outputs = this._orderDisplayedMetrics(calculator.output_ids, validOutputs)

    return (
      <CalculatorForm
        calculator={calculator}
        inputs={inputs}
        outputs={outputs}
        onMetricHide={this._onMetricHide.bind(this)}
        onMetricShow={this._onMetricShow.bind(this)}
        onMoveMetricTo={this._onMoveMetricTo.bind(this)}
        onChangeName={this._onChangeName.bind(this)}
        onChangeContent={this._onChangeContent.bind(this)}
        onSubmit={this._onCreate.bind(this)}
        isValid={this._isValid()}
        buttonText={buttonText}
      />
    )
  }
}

