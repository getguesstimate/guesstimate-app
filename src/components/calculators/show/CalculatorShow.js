import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ReactMarkdown from 'react-markdown'
import Icon from 'react-fa'

import {Input} from './input'
import {Output} from './output'

import {deleteSimulations, runSimulations} from 'gModules/simulations/actions'
import {changeGuesstimate} from 'gModules/guesstimates/actions'
import {Button} from 'gComponents/utility/buttons/button.js'

import {Guesstimator} from 'lib/guesstimator/index'

import '../style.css'

@connect(null, dispatch => bindActionCreators({changeGuesstimate, deleteSimulations, runSimulations}, dispatch))
export class CalculatorShow extends Component {
  state = {
    resultComputing: false,
    showResult: false,
    hasSimulated: false,
    readyToCalculate: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.resultComputing && this.allOutputsHaveStats()) {
      this.setState({resultComputing: false, showResult: true})
    }
  }

  changeGuesstimate({id, guesstimate}, input) {
    const parsed = Guesstimator.parse({...guesstimate, input})
    const guesstimateType = parsed[1].samplerType().referenceName
    this.props.changeGuesstimate(
      id,
      {...guesstimate, ...{data: null, input, guesstimateType}},
      false  // saveOnServer
    )
  }

  onBlur(metric, input) {
    // We only want to simulate anything if all the inputs have simulatable content.
    const [parseErrors] = Guesstimator.parse({...metric.guesstimate, input})
    if (!this.state.hasSimulated && !_.isEmpty(input) && _.isEmpty(parseErrors) && this.allInputsHaveContent([metric.id])) {
      _.defer(() => {
        this.props.inputs.forEach(i => this.changeGuesstimate(i, i.id === metric.id ? input : this.getInputContent(i)))
        this.props.deleteSimulations([...this.props.inputs.map(i => i.id), ...this.props.outputs.map(o => o.id)])
        this.props.runSimulations({spaceId: this.props.calculator.space_id, onlyUnsimulated: true})
      })
      this.setState({hasSimulated: true, resultComputing: true})
    }
  }

  onChange(metric, input) {
    if (this.allInputsHaveContent([metric.id]) && !_.isEmpty(input) && _.isEmpty(Guesstimator.parse({input})[0])) {
      if (this.state.hasSimulated) {
        this.changeGuesstimate(metric, input)
        this.props.runSimulations({metricId: metric.id})
      }
      if (!this.state.readyToCalculate) { this.setState({readyToCalculate: true}) }
    } else {
      if (this.state.readyToCalculate) { this.setState({readyToCalculate: false}) }
    }
  }

  onEnter(id) {
    this.refs[`input-${id}`].blur()
    if (!this.state.readyToCalculate) { return }
    if (this.allOutputsHaveStats() && this.state.hasSimulated) {
      if (!this.state.showResults) { this.setState({showResult: true}) }
    } else {
      if (!this.state.resultComputing) { this.setState({resultComputing: true}) }
    }
  }

  getInputContent({id}) { return this.refs[`input-${id}`].getContent() }

  allInputsHaveContent(idsToExclude=[]) {
    const includedInputs = this.props.inputs.filter(i => !_.some(idsToExclude, id => i.id === id))
    const inputComponents = _.map(includedInputs, metric => this.refs[`input-${metric.id}`])
    return _.every(inputComponents, i => !!i && i.hasValidContent())
  }

  allOutputsHaveStats() {
    return this.props.outputs.map(o => !!o && _.has(o, 'simulation.stats')).reduce((x,y) => x && y, true)
  }

  render() {
    const {calculator: {content, title, space_id, share_image}, size, inputs, outputs, isPrivate, classes} = this.props

    return (
      <div className={`${['calculator', ...classes].join(' ')}`}>
        <div className='padded-section'>
        <div className='title-bar'>
          <div className='row'>
            <div className='col-xs-10'>
              <h1>{title}</h1>
              {isPrivate && <span className='privacy-icon'><Icon name='lock'/>Private</span>}
            </div>
            {size === 'wide' &&
              <div className='col-xs-2 action-section'>
                <Button onClick={this.props.showHelp}>
                  <Icon name='question'/>
                  Help
                </Button>
              </div>
            }
          </div>
        </div>
        <div className='description'><ReactMarkdown source={content} /></div>
        <div className='inputs'>
          {_.map(inputs, (metric, i) => (
            <Input
              ref={`input-${metric.id}`}
              key={metric.id}
              id={metric.id}
              isFirst={i===0}
              name={metric.name}
              description={_.get(metric, 'guesstimate.description')}
              errors={_.get(metric, 'simulation.sample.errors')}
              onBlur={this.onBlur.bind(this, metric)}
              onChange={this.onChange.bind(this, metric)}
              onEnter={this.onEnter.bind(this)}
            />
          ))}
        </div>
        {this.state.showResult &&
          <div>
            <hr className='result-divider'/>
            <div className='outputs'>
              {_.map(outputs, m => <Output key={m.id} metric={m}/>)}
            </div>
          </div>
        }
        {!this.state.showResult &&
          <div className='row'>
            <div className='col-xs-12 col-md-7'/>
            <div className='col-xs-12 col-md-5'>
              <div
                className={`ui button calculateButton${this.state.resultComputing ? ' loading' : this.state.readyToCalculate ? '' : ' disabled'}`}
                onClick={() => {this.allOutputsHaveStats() ? this.setState({showResult: true}) : this.setState({resultComputing: true})}}
              >
                Calculate
              </div>
            </div>
          </div>
        }
      </div>
    </div>
    )
  }
}
