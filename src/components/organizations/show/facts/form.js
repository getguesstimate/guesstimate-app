import React, {Component, PropTypes} from 'react'

import {simulateFact, FactPT, getVariableNameFromName} from 'gEngine/facts'
import {addStats} from 'gEngine/simulation'

import './facts.css'

export class FactForm extends Component {
  static defaultProps = {
    startingFact: {
      name: '',
      expression: '',
      variable_name: '',
      simulation: {
        sample: {
          values: [],
          errors: [],
        },
      },
    }
  }

  static propTypes = {
    existingVariableNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func.isRequired,
    startingFact: FactPT,
  }

  state = {
    variableNameManuallySet: !_.isEmpty(_.get(this.props, 'startingFact.variable_name')),
    runningFact: this.props.startingFact,
  }

  setFactState(newFactState, otherState = {}) { this.setState({...otherState, runningFact: {...this.state.runningFact, ...newFactState}}) }
  onChangeName(e) {
    const name = _.get(e, 'target.value')
    this.setFactState(
      this.state.variableNameManuallySet ? {name} : {name, variable_name: getVariableNameFromName(name, this.props.existingVariableNames)}
    )
  }
  onChangeVariableName(e) { this.setFactState({variable_name: _.get(e, 'target.value')}, {variableNameManuallySet: true}) }
  onChangeExpression(e) { this.setFactState({expression: _.get(e, 'target.value')}) }
  onBlurExpression() {
    simulateFact(this.state.runningFact).then(({values, errors}) => {
      let simulation = {sample: {values, errors}}
      addStats(simulation)
      this.setFactState({simulation})
    })
  }

  isExpressionValid() { return _.isEmpty(_.get(this, 'state.runningFact.simulation.sample.errors')) }
  isVariableNameUnique() { return !_.some(this.props.existingVariableNames, n => n === this.state.runningFact.variable_name) }
  isValid() {
    const requiredProperties = [
      'name',
      'variable_name',
      'expression',
      'simulation.sample.values',
      'simulation.stats',
    ]
    const requiredPropertiesPresent = requiredProperties.map(prop => !_.isEmpty(_.get(this.state.runningFact, prop)))
    return _.every(requiredPropertiesPresent) && this.isExpressionValid() && this.isVariableNameUnique()
  }
  onSubmit() { this.props.onSubmit(this.state.runningFact) }

  render() {
    const buttonClasses = ['ui', 'button', ...(this.isValid() ? [] : ['disabled'])]
    const {props: {buttonText}, state: {runningFact: {expression, name, variable_name}}} = this

    return (
      <div className='Fact new ui form'>
        <div className='row'>
          <div className='col-md-3'>
            <div className={`field ${this.isExpressionValid() ? '' : 'error'}`}>
              <input
                type='text'
                placeholder='Expression'
                value={expression}
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
                value={name}
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
                value={variable_name}
                onChange={this.onChangeVariableName.bind(this)}
                onKeyDown={(e) => {if (e.keyCode === 13 && this.isValid()) {this.onSubmit()}}}
              />
            </div>
          </div>
          <div className='col-md-1'>
            <span className={buttonClasses.join(' ')} onClick={this.onSubmit.bind(this)}>{buttonText}</span>
          </div>
        </div>
      </div>
    )
  }
}
