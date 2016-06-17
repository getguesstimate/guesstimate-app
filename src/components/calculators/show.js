import React, {Component} from 'react'
import {connect} from 'react-redux'

import ReactMarkdown from 'react-markdown'

import {CalculatorInputCard} from 'gComponents/metrics/calculatorCard/input'
import {CalculatorOutputCard} from 'gComponents/metrics/calculatorCard/output'

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
      <CalculatorOutputCard metric={metric} />
    </div>
    <div className='col-md-3'/>
  </div>
)

const Input = ({dispatch, metric}) => (
  <div className='input row'>
    <div className='col-md-3'/>
    <div className='col-md-6'>
      <CalculatorInputCard metric={metric} />
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

    const inputs = metrics.filter(m => relationshipType(m.edges) === INPUT)
    const outputs = metrics.filter(m => relationshipType(m.edges) === OUTPUT)

    return (
      <div className='row'>
        <div className='col-md-3'/>
        <div className='col-md-6 calculator'>
          <div className='content'>
            <ReactMarkdown source={content} />
          </div>
          <div className='inputs'>
            {_.map(inputs, (m,i) => (
              <Input
                key={i}
                metric={m}
                dispatch={this.props.dispatch}
              />
            ))}
          </div>
          <hr />
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
