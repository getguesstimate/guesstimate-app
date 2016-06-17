import React, {Component} from 'react'
import {connect} from 'react-redux'

import ReactMarkdown from 'react-markdown'

import {MetricCalculatorCard} from 'gComponents/metrics/calculatorCard/index'

import {calculatorSpaceSelector} from './calculator-space-selector'

import * as spaceActions from 'gModules/spaces/actions'
import {runSimulations} from 'gModules/simulations/actions'

import './style.css'

const INTERMEDIATE = 'INTERMEDIATE'
const OUTPUT = 'OUTPUT'
const INPUT = 'INPUT'
const NOEDGE = 'NOEDGE'

const relationshipType = (edges) => {
  if (edges.inputs.length && edges.outputs.length) { return INTERMEDIATE }
  if (edges.inputs.length) { return OUTPUT }
  if (edges.outputs.length) { return INPUT }
  return NOEDGE
}

const Output = ({metric}) => (
  <div className='output row'>
    <div className='col-md-3'/>
    <div className='col-md-6'>
      WOO HOOOO
    </div>
    <div className='col-md-3'/>
  </div>
)

const Question = ({dispatch, metric}) => (
  <div className='question row'>
    <div className='col-md-3'/>
    <div className='col-md-6'>
      <MetricCalculatorCard
        dispatch={dispatch}
        metric={metric}
      />
    </div>
    <div className='col-md-3'/>
  </div>
)

@connect(calculatorSpaceSelector)
export class CalculatorShow extends Component {
  state = {attemptedFetch: false}

  componentDidMount() { this.fetchData() }
  componentWillReceiveProps(nextProps) {
    if (!this.props.space && !!nextProps.space) {
      this.props.dispatch(runSimulations({spaceId: this.props.calculator.space_id}))
    }
  }
  componentDidUpdate() { this.fetchData() }

  fetchData() {
    if (!this.state.attemptedFetch) {
      this.props.dispatch(spaceActions.fetchById(this.props.calculator.space_id))
      this.setState({attemptedFetch: true})
    }
  }

  render() {
    if (!this.props.space || !this.props.calculator) { return false }

    const {content} = this.props.calculator
    const {space: {metrics}} = this.props

    const questions = metrics.filter(m => relationshipType(m.edges) === INPUT)
    const outputs = metrics.filter(m => relationshipType(m.edges) === OUTPUT)

    return (
      <div className='row'>
        <div className='col-md-3'/>
        <div className='col-md-6 calculator'>
          <div className='content'>
            <ReactMarkdown source={content} />
          </div>
          <div className='questions'>
            {_.map(questions, (m,i) => (
              <Question
                key={i}
                metric={m}
                dispatch={this.props.dispatch}
              />
            ))}
          </div>
          <div className='outputs'>
            {_.map(outputs, (m,i) => (
              <Output
                key={i}
                metric={m}
              />
            ))}
          </div>
        </div>
        <div className='col-md-3' />
      </div>
    )
  }
}
