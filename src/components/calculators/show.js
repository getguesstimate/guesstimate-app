import React, {Component} from 'react'
import {connect} from 'react-redux'

import ReactMarkdown from 'react-markdown'

import DistributionEditor from 'gComponents/distributions/editor/index'
import {CalculatorOutputCard} from 'gComponents/metrics/calculatorCard/output'

import {calculatorSpaceSelector} from './calculator-space-selector'

import * as calculatorActions from 'gModules/calculators/actions'
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
      <CalculatorOutputCard
        metric={metric}
      />
    </div>
    <div className='col-md-3'/>
  </div>
)

const Input = ({metric: {guesstimate, name, id}}) => (
  <div className='input row'>
    <div className='col-md-7'>{name}</div>
    <div className='editor col-md-5'>
      <DistributionEditor
        hideGuesstimateType={true}
        skipSaves={true}
        guesstimate={{...guesstimate, ...{input: ''}}}
        metricId={id}
        size='small'
      />
    </div>
  </div>
)

@connect(calculatorSpaceSelector)
export class CalculatorShow extends Component {
  state = {
    attemptedFetch: false,
    showResult: false,
  }

  componentDidMount() { this.fetchData() }
  componentWillReceiveProps(nextProps) {
    if (!this.props.space && !!nextProps.space) {
      this.props.dispatch(runSimulations({spaceId: nextProps.space.id}))
    }
  }
  componentDidUpdate() { this.fetchData() }

  fetchData() {
    if (!this.state.attemptedFetch) {
      this.props.dispatch(calculatorActions.fetchById(this.props.calculatorId))
      this.setState({attemptedFetch: true})
    }
  }

  render() {
    if (!this.props.space || !this.props.calculator) { return false }

    const {content, title, input_ids, output_ids} = this.props.calculator
    const {space: {metrics}} = this.props

    const findById = id => metrics.find(m => m.id === id)
    const inputs = input_ids.map(findById).filter(m => relationshipType(m.edges) === INPUT)
    const outputs = output_ids.map(findById).filter(m => relationshipType(m.edges) === OUTPUT)

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
                index={i}
                metric={m}
                dispatch={this.props.dispatch}
              />
            ))}
          </div>
          {this.state.showResult &&
            <div>
              <h2> Result: </h2>
              <div className='outputs'>
                {_.map(outputs, (m,i) => (
                  <Output
                    key={i}
                    metric={m}
                  />
                ))}
              </div>
            </div>
          }
          {!this.state.showResult &&
            <div className='row'>
              <div className='col-md-7' />
              <div className='col-md-5'>
                <div
                  className='ui button green calculateButton'
                  onClick={() => {this.setState({showResult: true})}}
                >
                  Calculate
                </div>
              </div>
            </div>
          }
        </div>
        <div className='col-md-3' />
      </div>
    )
  }
}
