import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ReactMarkdown from 'react-markdown'
import Helmet from 'react-helmet'
import {ShareButtons, generateShareIcon} from 'react-share'
import Icon from 'react-fa'

import Container from 'gComponents/utility/container/Container.js'
import {Input} from '../shared/input'
import {Output} from '../shared/output'

import {newCalculatorSelector} from './new-calculator-selector'

import {navigate} from 'gModules/navigation/actions'
import {fetchById} from 'gModules/spaces/actions'
import {create} from 'gModules/calculators/actions'
import {runSimulations} from 'gModules/simulations/actions'
import {changeGuesstimate} from 'gModules/guesstimates/actions'

import * as Space from 'gEngine/space'
import * as Calculator from 'gEngine/calculator'

import {Guesstimator} from 'lib/guesstimator/index'

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

@connect(newCalculatorSelector, dispatch => bindActionCreators({navigate, create, fetchById, changeGuesstimate, runSimulations}, dispatch))
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

  _onCreate() {
    const calculator = this.state.calculator
    this.props.create(this.props.space_id, {calculator})
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
        onRemoveMetric={this._onRemoveMetric.bind(this)}
        onAddMetric={this._onAddMetric.bind(this)}
        onMoveMetricUp={this._onMoveMetricUp.bind(this)}
        onMoveMetricDown={this._onMoveMetricDown.bind(this)}
        onSubmit={this._onCreate.bind(this)}
      />
    )
  }
}

export class CalculatorNew extends Component {
  inputForm(items, item, index){
    return (
      <InputForm
        ref={`input-${item.metric.id}`}
        key={index}
        name={item.metric.name}
        isFirst={index === 0}
        isLast={index === items.length - 1}
        description={_.get(item.metric, 'guesstimate.description')}
        isVisible={item.isVisible}
        onRemove={() => {this.props.onRemoveMetric(item.metric.id)}}
        onAdd={() => {this.props.onAddMetric(item.metric.id)}}
        onMoveUp={() => {this.props.onMoveMetricUp(item.metric.id)}}
        onMoveDown={() => {this.props.onMoveMetricDown(item.metric.id)}}
      />
    )
  }

  outputForm(items, item, index){
    return(
      <OutputForm
        key={index}
        name={item.metric.name}
        isFirst={index === 0}
        isLast={index === items.length - 1}
        isVisible={item.isVisible}
        onRemove={() => {this.props.onRemoveMetric(item.metric.id)}}
        onAdd={() => {this.props.onAddMetric(item.metric.id)}}
        onMoveUp={() => {this.props.onMoveMetricUp(item.metric.id)}}
        onMoveDown={() => {this.props.onMoveMetricDown(item.metric.id)}}
      />
    )
  }

  render() {
    const {calculator: {title, content}, inputs, outputs} = this.props
    const visibleInputs = inputs.filter(i => i.isVisible)
    const invisibleInputs = inputs.filter(i => !i.isVisible)
    const hasHiddenInputs = !_.isEmpty(invisibleInputs)

    const visibleOutputs = outputs.filter(i => i.isVisible)
    const invisibleOutputs = outputs.filter(i => !i.isVisible)
    const hasHiddenOutputs = !_.isEmpty(invisibleOutputs)

    return (
      <Container>
        <div className='row'>
          <div className='col-xs-0 col-md-2'/>
          <div className='col-xs-12 col-md-8'>
            <div className='calculator'>
              <h1>{title}</h1>
              <div className='description'>
              </div>

              <div className='section'>
                <h2> {`${hasHiddenInputs ? "Visible " : ""}Inputs`} </h2>
              </div>
              <div className='inputs'>
                {_.map(visibleInputs, (input, i) => (
                  this.inputForm(visibleInputs, input,i)
                ))}
              </div>

              {hasHiddenInputs &&
                <div>
                  <div className='section faint'>
                    <h2> Hidden Inputs </h2>
                  </div>
                  <div className='inputs'>
                    {_.map(invisibleInputs, (input, i) => (
                      this.inputForm(inputs, input,i)
                    ))}
                  </div>
                </div>
                }

              <div>
                <div className='section'>
                  <h2> {`${hasHiddenOutputs ? "Visible " : ""}Outputs`} </h2>
                </div>

                <div className='outputs'>

                  {_.map(visibleOutputs, (input, i) => (
                      this.outputForm(inputs, input,i)
                    )
                  )}

                  {hasHiddenOutputs &&
                    <div>
                      <div className='section faint'>
                        <h2> Hidden Outputs </h2>
                      </div>

                      {_.map(invisibleOutputs, (input, i) => (
                          this.outputForm(inputs, input,i)
                        )
                      )}
                    </div>
                  }
                </div>
              </div>

              <hr className='result-divider'/>

              <div className='create-button-section'>
                <div className='row'>
                  <div className='col-md-5'>
                    <div className='ui button green create-button' onClick={this.props.onSubmit}>
                      Create
                    </div>
                  </div>
                  <div className='col-md-7' />
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

export const EditSection = ({isFirst, isLast, isVisible, onRemove, onAdd, onMoveUp, onMoveDown}) => (
  <div>
    {isVisible &&
      <div>
        <a onMouseDown={onRemove}><Icon name='minus-circle'/></a>
        {!isFirst && <a onMouseDown={onMoveUp}><Icon name='chevron-up'/></a>}
        {!isLast && <a onMouseDown={onMoveDown}><Icon name='chevron-down'/></a>}
      </div>
    }
    {!isVisible &&
      <a onMouseDown={onAdd}><Icon name='plus-circle'/></a>
    }
  </div>
)

export class InputForm extends Component{
  render () {
    const {name, description} = this.props
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
            <EditSection {...this.props}/>
          </div>
        </div>
      </div>
    )
  }
}

export const OutputForm = (props) => {
  return (
    <div className='output'>
      <div className='row'>
        <div className='col-xs-12 col-sm-7'>
          <div className='name'>
            {props.name}
          </div>
        </div>
        <div className='col-xs-12 col-sm-5'>
            <EditSection {...props}/>
        </div>
      </div>
    </div>
  )
}
