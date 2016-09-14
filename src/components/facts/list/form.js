import React, {Component, PropTypes} from 'react'

import {navigateFn} from 'gModules/navigation/actions'

import {spaceUrlById} from 'gEngine/space'
import {hasRequiredProperties, isExportedFromSpace, simulateFact, FactPT} from 'gEngine/facts'
import {addStats} from 'gEngine/simulation'

import {isData, formatData} from 'lib/guesstimator/formatter/formatters/Data'
import {getVariableNameFromName} from 'lib/generateVariableNames/nameToVariableName'

export class FactForm extends Component {
  static defaultProps = {
    startingFact: {
      name: '',
      expression: '',
      variable_name: '',
      exported_from_id: null,
      metric_id: null,
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
    onCancel: PropTypes.func,
    startingFact: FactPT,
  }

  state = {
    runningFact: this.props.startingFact,
    variableNameManuallySet: !_.isEmpty(_.get(this.props, 'startingFact.variable_name')),
    currentExpressionSimulated: true,
    submissionPendingOnSimulation: false,
  }

  componentDidUpdate(_1, prevState) {
    if (this.state.currentExpressionSimulated && prevState.submissionPendingOnSimulation) {
      this.onSubmit()
    }
  }

  setFactState(newFactState, otherState = {}) { this.setState({...otherState, runningFact: {...this.state.runningFact, ...newFactState}}) }
  onChangeName(e) {
    const name = _.get(e, 'target.value')
    this.setFactState(
      this.state.variableNameManuallySet ? {name} : {name, variable_name: getVariableNameFromName(name, this.props.existingVariableNames)}
    )
  }
  onChangeVariableName(e) { this.setFactState({variable_name: _.get(e, 'target.value')}, {variableNameManuallySet: true}) }
  onChangeExpression(e) { this.setFactState({expression: _.get(e, 'target.value')}, {currentExpressionSimulated: false}) }
  onBlurExpression() { this.simulateCurrentExpression() }
  simulateCurrentExpression() {
    const {runningFact} = this.state
    if (isData(runningFact.expression)) {
      let simulation = {sample: {values: formatData(runningFact.expression)}}
      addStats(simulation)
      this.setFactState({simulation}, {currentExpressionSimulated: true})
    } else {
      simulateFact(this.state.runningFact).then(sample => {
        let simulation = {sample}
        addStats(simulation)
        this.setFactState({simulation}, {currentExpressionSimulated: true})
      })
    }
  }

  hasNoErrors() { return _.isEmpty(_.get(this, 'state.runningFact.simulation.sample.errors')) }
  isVariableNameUnique() { return !_.some(this.props.existingVariableNames, n => n === this.state.runningFact.variable_name) }
  isValid() { return hasRequiredProperties(this.state.runningFact) && this.hasNoErrors() && this.isVariableNameUnique() }

  onSubmit() {
    if (this.state.currentExpressionSimulated) {
      this.props.onSubmit(this.state.runningFact)
    } else {
      this.setState({submissionPendingOnSimulation: true})
    }
  }

  submitIfEnter(e) {
    if (e.keyCode === 13 && this.isValid()) {this.onSubmit()}
  }

  renderEditExpressionSection() {
    if (isExportedFromSpace(this.state.runningFact)) {
      const exported_from_url = `${spaceUrlById(_.get(this, 'state.runningFact.exported_from_id'))}?factsShown=true`
      return (
        <div className='section-simulation simulation-sample'>
          <span className='ui button small options' onClick={navigateFn(exported_from_url)}>Edit Model</span>
        </div>
      )
    } else {
      return (
        <div className='section-simulation simulation-sample'>
          <div className={`field ${this.hasNoErrors() ? '' : 'error'}`}>
            <input
              type='text'
              placeholder='value'
              value={this.state.runningFact.expression}
              onChange={this.onChangeExpression.bind(this)}
              onBlur={this.onBlurExpression.bind(this)}
            />
          </div>
        </div>
      )
    }
  }

  render() {
    const {
      props: {buttonText, onCancel, onDelete},
      state: {submissionPendingOnSimulation, runningFact: {expression, name, variable_name}}
    } = this

    let buttonClasses = ['ui', 'button', 'small', 'primary']
    if (submissionPendingOnSimulation) {
      buttonClasses.push('disabled', 'loading')
    } else if (!this.isValid()) {
      buttonClasses.push('disabled')
    }

    return (
    <div className='Fact--outer'>
      <div className='Fact new ui form'>
        {this.renderEditExpressionSection()}
        <div className='section-name'>
          <div className='fact-name'>
            <div className={`field ${this.isVariableNameUnique() ? '' : 'error'}`}>
              <textarea
                type='text'
                rows='1'
                placeholder='name'
                value={name}
                onChange={this.onChangeName.bind(this)}
                onKeyDown={this.submitIfEnter.bind(this)}
              />
            </div>
          </div>
          <div className='variable-name'>
            <div className='field'>
              <span className='prefix'>#</span>
              <input
                type='text'
                placeholder='hashtag'
                value={variable_name}
                onChange={this.onChangeVariableName.bind(this)}
                onKeyDown={this.submitIfEnter.bind(this)}
              />
            </div>
          </div>
          <div className='actions'>
            <span className={buttonClasses.join(' ')} onClick={this.onSubmit.bind(this)}>{buttonText}</span>
            {!!onCancel && <span className='ui button small' onClick={onCancel}>Cancel</span>}
            {!!onDelete && <span className='ui button small' onClick={onDelete}>Delete</span>}
          </div>
        </div>
      </div>
    </div>
    )
  }
}
