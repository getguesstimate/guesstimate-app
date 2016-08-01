import React, {Component} from 'react'
import {connect} from 'react-redux'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'

import {simulateFact} from 'gEngine/facts'
import {addStats} from 'gEngine/simulation'

import './facts.css'


// TODO(matthew): Also add validations for values on the server.

const FactRow = ({fact}) => (
  <div className='Fact'>
    <div className='row'>
      <div className='col-md-3'>
        <Histogram
          height={30}
          simulation={fact.simulation}
          cutOffRatio={0.995}
        />
      </div>
      <div className='col-md-6'><span className='name'>{fact.name}</span></div>
      <div className='col-md-2'>
        <div className='variableName'>
          <span className='prefix'>#</span>
          <span className='variable'>{fact.variable_name}</span>
        </div>
      </div>
      <div className='col-md-1'>
        <span className='ui button options'><Icon name='ellipsis-v' /></span>
      </div>
    </div>
  </div>
)

const hasAllNonEmpty = (obj, props) => !_.some(props.map(prop => _.isEmpty(_.get(obj, prop))))
const readableIdPartFromWord = word => (/\d/).test(word) ? word : word[0]
function getVariableNameFromName(rawName) {
  const name = rawName.trim().replace(/[^\w\d]/g, ' ').toLowerCase()
  const words = name.split(/[^\w\d]/).filter(s => !_.isEmpty(s))
  if (words.length === 1 && name.length < 10) {
    return name
  } else if (words.length < 3) {
    return name.slice(0,3)
  } else {
    return words.map(readableIdPartFromWord).join('')
  }
}

class NewFactRow extends Component {
  state = {
    variableNameManuallySet: false,
    fact: {
      name: '',
      variable_name: '',
      expression: '',
      simulation: {
        sample: {
          values: [],
          errors: [],
        },
        stats: {
          adjustedConfidenceInterval: [],
          mean: null,
          stdev: null,
          length: 0,
        },
      },
    },
  }

  setFactState(newFactState, otherState = {}) { this.setState({...otherState, fact: {...this.state.fact, ...newFactState}}) }
  onChangeName(e) {
    const name = _.get(e, 'target.value')
    this.setFactState(this.state.variableNameManuallySet ? {name} : {name, variable_name: getVariableNameFromName(name)})
  }
  onChangeVariableName(e) { this.setFactState({variable_name: _.get(e, 'target.value')}, {variableNameManuallySet: true}) }
  onChangeExpression(e) { this.setFactState({expression: _.get(e, 'target.value')}) }

  onBlurExpression() {
    simulateFact(['biz'], this.state.fact).then(({values, errors}) => {
      let simulation = {sample: {values, errors}}
      addStats(simulation)
      simulation.sample.sortedValues = null // We don't want to send this to the server for latency reasons.
      this.setFactState({simulation})
    })
  }

  isExpressionValid() { return _.isEmpty(_.get(this, 'state.fact.simulation.sample.errors')) }
  isVariableNameUnique() { return !_.some(this.props.existingVariableNames, n => n === this.state.fact.variable_name) }
  isValid() {
    const hasRequisiteProperties = hasAllNonEmpty(
      this.state.fact,
      [
        'name',
        'variable_name',
        'expression',
        'simulation.sample.values',
        'simulation.stats',// TODO(matthew): this isn't really checking anything, as simulation.stats starts non-empty.
      ]
    )
    return hasRequisiteProperties && this.isExpressionValid() && this.isVariableNameUnique()
  }
  onSubmit() { this.props.onSubmit(this.state.fact) }

  render() {
    const buttonClasses = ['ui', 'button', ...(this.isValid() ? [] : ['disabled'])]
    return (
      <div className='Fact new ui form'>
        <div className='row'>
          <div className='col-md-3'>
            <div className={`field ${this.isExpressionValid() ? '' : 'error'}`}>
              <input
                type='text'
                placeholder='Expression'
                value={this.state.fact.expression}
                onChange={this.onChangeExpression.bind(this)}
                onBlur={this.onBlurExpression.bind(this)}
              />
            </div>
          </div>
          <div className='col-md-6'>
            <div class='field'>
              <input
                type='text'
                placeholder='Name'
                value={this.state.fact.name}
                onChange={this.onChangeName.bind(this)}
                onKeyDown={(e) => {if (e.keyCode === 13 && this.isValid()) {this.onSubmit()}}}
              />
            </div>
          </div>
          <div className='col-md-2'>
            <div className={`variableName field ${this.isVariableNameUnique() ? '' : 'error'}`}>
              <span className='prefix'>#</span>
              <input
                type='text'
                placeholder='Variable Name'
                value={this.state.fact.variable_name}
                onChange={this.onChangeVariableName.bind(this)}
                onKeyDown={(e) => {if (e.keyCode === 13 && this.isValid()) {this.onSubmit()}}}
              />
            </div>
          </div>
          <div className='col-md-1'>
            <span className={buttonClasses.join(' ')} onClick={this.onSubmit.bind(this)}><Icon name='plus' /></span>
          </div>
        </div>
      </div>
    )
  }
}

export const FactBookTab = ({facts, onAddFact}) => (
  <div className='FactsTab'>
    {_.map(facts, fact => <FactRow key={fact.id} fact={fact} />)}
    <NewFactRow
      key='new'
      existingVariableNames={_.map(facts, f => f.variable_name)}
      onSubmit={onAddFact}
    />
  </div>
)
