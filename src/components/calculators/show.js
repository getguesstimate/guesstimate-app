import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ReactMarkdown from 'react-markdown'
import Helmet from 'react-helmet'
import {ShareButtons, generateShareIcon} from 'react-share'

import Container from 'gComponents/utility/container/Container.js'
import {Input} from './input'
import {Output} from './output'

import {calculatorSpaceSelector} from './calculator-space-selector'

import {navigate} from 'gModules/navigation/actions'
import {fetchById} from 'gModules/calculators/actions'
import {runSimulations} from 'gModules/simulations/actions'
import {changeGuesstimate} from 'gModules/guesstimates/actions'

import * as Space from 'gEngine/space'
import * as Calculator from 'gEngine/calculator'

import {Guesstimator} from 'lib/guesstimator/index'

import './style.css'

@connect(calculatorSpaceSelector, dispatch => bindActionCreators({navigate, fetchById, changeGuesstimate, runSimulations}, dispatch))
export class CalculatorShow extends Component {
  state = {
    attemptedFetch: false,
    showResult: false,
  }

  componentWillMount() { this.fetchData() }
  componentWillReceiveProps(nextProps) {
    this.fetchData()
    if (!this.props.calculator && !!nextProps.calculator) {
      this.props.runSimulations({spaceId: nextProps.calculator.space_id})
    }
  }

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

  allInputsHaveContent() {
    const inputComponents = _.map(this.props.inputs, metric => this.refs[`input-${metric.id}`])
    return inputComponents.map(i => !!i && i.hasValidContent()).reduce((x,y) => x && y, true)
  }

  render() {
    if (!this.props.calculator) { return false }

    const {calculator: {content, title, space_id}, inputs, outputs, navigate} = this.props
    const spaceUrl = Space.url({id: space_id})
    const calculatorUrl = Calculator.fullUrl(this.props.calculator)

    const {FacebookShareButton, TwitterShareButton} = ShareButtons
    const FacebookIcon = generateShareIcon('facebook')
    const TwitterIcon = generateShareIcon('twitter')
    return (
      <Container>
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
          <div className='col-md-6'>
            <div className='calculator'>
              <h1>{title}</h1>
              <div className='description'>
                <ReactMarkdown source={content} />
              </div>
              <div className='inputs'>
                {_.map(inputs, (metric, i) => (
                  <Input
                    ref={`input-${metric.id}`}
                    key={i}
                    isFirst={i===0}
                    name={metric.name}
                    errors={_.get(metric, 'simulation.sample.errors')}
                    onChange={this.onChange.bind(this, metric)}
                  />
                ))}
              </div>
              {this.state.showResult &&
                <div>
                  <hr className='result-divider'/>
                  <div className='outputs'>
                    {_.map(outputs, (m, i) => <Output key={i} metric={m}/>)}
                  </div>
                  <div className='row information-section'>
                    <div className='col-xs-12 col-md-7 calculation-link-section'>
                        <a href={spaceUrl} onClick={navigate.bind(spaceUrl)}>See calculations</a>
                    </div>
                    <div className='col-xs-12 col-md-5'>
                      <FacebookShareButton url={calculatorUrl} title={title}>
                        <FacebookIcon size={42}/>
                      </FacebookShareButton>
                      <TwitterShareButton url={calculatorUrl} title={title}>
                        <TwitterIcon size={42}/>
                      </TwitterShareButton>
                    </div>
                  </div>
                </div>
              }
              {!this.state.showResult &&
                <div className='row'>
                  <div className='col-md-7' />
                  <div className='col-md-5'>
                    <div
                      className={`ui button green calculateButton${this.allInputsHaveContent() ? '' : ' disabled'}`}
                      onClick={() => {this.setState({showResult: true})}}
                    >
                      Calculate
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className='col-md-3' />
        </div>
      </Container>
    )
  }
}
