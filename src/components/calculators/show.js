import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ReactMarkdown from 'react-markdown'
import Helmet from 'react-helmet'

import {Input} from './input'
import {CalculatorOutputCard} from 'gComponents/metrics/calculatorCard/output'

import {calculatorSpaceSelector} from './calculator-space-selector'

import * as calculatorActions from 'gModules/calculators/actions'
import {runSimulations} from 'gModules/simulations/actions'
import {changeGuesstimate} from 'gModules/guesstimates/actions'

import {Guesstimator} from 'lib/guesstimator/index'

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

@connect(calculatorSpaceSelector, dispatch => bindActionCreators({...calculatorActions, changeGuesstimate, runSimulations}, dispatch))
export class CalculatorShow extends Component {
  state = {
    attemptedFetch: false,
    showResult: false,
  }

  componentDidMount() { this.fetchData() }
  componentWillReceiveProps(nextProps) {
    if (!this.props.space && !!nextProps.space) {
      this.props.runSimulations({spaceId: nextProps.space.id})
    }
  }
  componentDidUpdate() { this.fetchData() }

  fetchData() {
    if (!this.state.attemptedFetch) {
      this.props.fetchById(this.props.calculatorId)
      this.setState({attemptedFetch: true})
    }
  }

  onChange({id, guesstimate}, input) {
    const guesstimateType = Guesstimator.parse({...guesstimate, input})[1].samplerType().referenceName

    this.props.changeGuesstimate(
      id,
      {...guesstimate, ...{data: null, input, guesstimateType}},
      true, // runSims
      false // saveOnServer
    )
  }

  render() {
    if (!this.props.space || !this.props.calculator) { return false }

    const {content, title, input_ids, output_ids} = this.props.calculator
    const {space: {metrics}} = this.props

    const findById = id => metrics.find(m => m.id === id)
    const inputs = input_ids.map(findById).filter(m => relationshipType(m.edges) === INPUT)
    const outputs = output_ids.map(findById).filter(m => relationshipType(m.edges) === OUTPUT)

    return (
      <div>
        <Helmet
          title={title}
          meta={[
            {name: "Description", content},
            {property: "og:description", content},
            {property: "og:title", content: title},
            {property: "og:site_name", content: "Guesstimate"},
          ]}
        />
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
                  name={m.name}
                  onChange={this.onChange.bind(this, m)}
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
                <div
                  className='col-md-5 ui button green calculateButton'
                  onClick={() => {this.setState({showResult: true})}}
                >
                  Calculate
                </div>
              </div>
            }
          </div>
          <div className='col-md-3' />
        </div>
      </div>
    )
  }
}
