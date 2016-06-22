import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ReactMarkdown from 'react-markdown'
import Helmet from 'react-helmet'

import {Input} from './input'
import {Output} from './output'

import {calculatorSpaceSelector} from './calculator-space-selector'

import {fetchById} from 'gModules/calculators/actions'
import {runSimulations} from 'gModules/simulations/actions'
import {changeGuesstimate} from 'gModules/guesstimates/actions'

import {Guesstimator} from 'lib/guesstimator/index'

import './style.css'

@connect(calculatorSpaceSelector, dispatch => bindActionCreators({fetchById, changeGuesstimate, runSimulations}, dispatch))
export class CalculatorShow extends Component {
  state = {
    attemptedFetch: false,
    showResult: false,
  }

  componentDidMount() { this.fetchData() }
  componentWillReceiveProps(nextProps) {
    if (!this.props.calculator && !!nextProps.calculator) {
      this.props.runSimulations({spaceId: nextProps.calculator.space_id})
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
    if (!this.props.calculator) { return false }

    const {calculator: {content, title}, inputs, outputs} = this.props
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
              {_.map(inputs, (metric, i) => (
                <Input key={i} name={metric.name} onChange={this.onChange.bind(this, metric)}/>
              ))}
            </div>
            {this.state.showResult &&
              <div>
                <hr className='result-divider'/>
                <div className='outputs'>
                  {_.map(outputs, (m, i) => <Output key={i} metric={m}/>)}
                </div>
              </div>
            }
            {!this.state.showResult &&
              <div className='row'>
                <div className='col-md-7' />
                <div
                  className='col-md-5'
                >
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
      </div>
    )
  }
}
