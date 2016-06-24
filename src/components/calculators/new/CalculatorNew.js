import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ReactMarkdown from 'react-markdown'
import Helmet from 'react-helmet'
import {ShareButtons, generateShareIcon} from 'react-share'

import Container from 'gComponents/utility/container/Container.js'
import {Input} from '../shared/input'
import {Output} from '../shared/output'

import {newCalculatorSelector} from './new-calculator-selector'

import {navigate} from 'gModules/navigation/actions'
import {fetchById} from 'gModules/spaces/actions'
import {runSimulations} from 'gModules/simulations/actions'
import {changeGuesstimate} from 'gModules/guesstimates/actions'

import * as Space from 'gEngine/space'
import * as Calculator from 'gEngine/calculator'

import {Guesstimator} from 'lib/guesstimator/index'

import '../shared/style.css'

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

@connect(newCalculatorSelector, dispatch => bindActionCreators({navigate, fetchById, changeGuesstimate, runSimulations}, dispatch))
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
    if (!!space.id && !this.state.setupNewCalculator){
      const validMetrics = space.metrics.filter(m => isCalculatorAcceptableMetric)
      const validInputs = validMetrics.filter(m => relationshipType(m.edges) === INPUT)
      const validOutputs = validMetrics.filter(m => relationshipType(m.edges) === OUTPUT)
      const calculator = {
         title: space.name || "",
         content: space.description || "",
         input_ids: validInputs.map(e => e.id),
         output_ids: validOutputs.map(e => e.id)
      }
      this.setState({calculator, validInputs, validOutputs, setupNewCalculator: true})
    }
  }

  _onRemoveMetric(id){
    const {calculator} = this.state
    this.setState({
      calculator: {
        ...calculator,
        input_ids: calculator.input_ids.filter(m => m !== id),
        output_ids: calculator.output_ids.filter(m => m !== id),
      }
    })
  }

  _onAddMetric(id){
    const {calculator} = this.state
    const isInput = _.some(this.state.validInputs, e => e.id === id)
    let {input_ids, output_ids} = calculator

    let new_input_ids, new_output_ids
    if (isInput) {
      new_input_ids = [...input_ids, id]
      new_output_ids = output_ids
    } else {
      new_output_ids = [...input_ids, id]
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

  _onMoveMetricUp(id){
    const {calculator} = this.state
    let {input_ids, output_ids} = calculator
    this.setState({
      calculator: {
        ...calculator,
        input_ids: incrementItemPosition(this.state.calculator.input_ids, id, true),
        output_ids: output_ids
      }
    })
  }

  _onMoveMetricDown(id){
    const {calculator} = this.state
    let {input_ids, output_ids} = calculator
    this.setState({
      calculator: {
        ...calculator,
        input_ids: incrementItemPosition(this.state.calculator.input_ids, id, false),
        output_ids: output_ids
      }
    })
  }

  _isVisible(metricId) {
    const {calculator} = this.state
    let {input_ids, output_ids} = calculator
    return _.some([...input_ids, ...output_ids], e => metricId === e)
  }

  render() {
    const {validInputs, validOutputs, calculator} = this.state
    const inputs = [
      ...calculator.input_ids.map(i => validInputs.find(m => m.id === i)),
      ...validInputs.filter(i => !this._isVisible(i.id))
    ].map(e => {return {metric: e, isVisible: this._isVisible(e.id)}})
    console.log(calculator.input_ids, inputs)

    const outputs = [
      ...calculator.output_ids.map(i => validOutputs.find(m => m.id === i)),
      ...validOutputs.filter(i => !this._isVisible(i.id))
    ].map(e => {return {metric: e, isVisible: this._isVisible(e.id)}})

    if (!this.state.setupNewCalculator){ return (false) }
    return (
      <CalculatorNew
        calculator={calculator}
        inputs={inputs}
        outputs={outputs}
        onRemoveMetric={this._onRemoveMetric.bind(this)}
        onAddMetric={this._onAddMetric.bind(this)}
        onMoveMetricUp={this._onMoveMetricUp.bind(this)}
        onMoveMetricDown={this._onMoveMetricDown.bind(this)}
      />
    )
  }
}

export class CalculatorNew extends Component {
  render() {
    const {calculator: {title, content}, inputs, outputs} = this.props
    return (
      <Container>
        <div className='row'>
          <div className='col-xs-0 col-md-2'/>
          <div className='col-xs-12 col-md-8'>
            <div className='calculator'>
              <h1>{title}</h1>
              <div className='description'>
              </div>
              <div className='inputs'>
                {_.map(inputs, (input, i) => (
                  <InputForm
                    ref={`input-${input.metric.id}`}
                    key={i}
                    name={input.metric.name}
                    description={_.get(input.metric, 'guesstimate.description')}
                    isVisible={input.isVisible}
                    onRemove={() => {this.props.onRemoveMetric(input.metric.id)}}
                    onAdd={() => {this.props.onAddMetric(input.metric.id)}}
                    onMoveUp={() => {this.props.onMoveMetricUp(input.metric.id)}}
                    onMoveDown={() => {this.props.onMoveMetricDown(input.metric.id)}}
                  />
                ))}
              </div>

                <div>
                  <hr className='result-divider'/>
                  <div className='outputs'>
                      {_.map(outputs, (m, i) => <OutputForm key={i} metric={m.metric}/>)}
                  </div>
                </div>

            </div>
          </div>
          <div className='col-md-3' />
        </div>
      </Container>
    )
  }
}

export class InputForm extends Component{
  render () {
    const {name, description, isVisible, onRemove, onAdd, onMoveUp, onMoveDown} = this.props
    return (
      <div className='input'>
        <div className='row'>
          <div className='col-xs-12 col-sm-7'>
            <div className='name'>{name}</div>
            {description &&
              <div className='description'>{description}</div>
            }
          </div>
          <div className='col-xs-12 col-sm-5'>
            {isVisible &&
              <div>
                <a onMouseDown={onRemove}>Remove</a>
                <a onMouseDown={onMoveUp}>Up</a>
                <a onMouseDown={onMoveDown}>Down</a>
              </div>
            }
            {!isVisible &&
              <a onMouseDown={onAdd}>Add</a>
            }
          </div>
        </div>
      </div>
    )
  }
}

export const OutputForm = ({metric: {name}}) => {
  return (
    <div className='output'>
      <div className='row'>
        <div className='col-xs-12 col-sm-7'>
          <div className='name'>
            {name}
          </div>
        </div>
        <div className='col-xs-12 col-sm-5'>
        </div>
      </div>
    </div>
  )
}
