import React, {Component} from 'react'
import {connect} from 'react-redux'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'

import {simulateFact} from 'gEngine/facts'

import {sortDescending} from 'lib/dataAnalysis'

import './facts.css'


// TODO(matthew): Add sortedValues to fact def'n on server, save those, don't re-sort here all the time. Though, its
// probably fine for now. Probably the other stats too.
// TODO(matthew): Also add validations for values on the server.

const FactRow = ({fact}) => (
  <div className='Fact'>
    <div className='row'>
      <div className='col-md-3'>
        <Histogram
          height={30}
          simulation={{sample: {sortedValues: sortDescending(fact.values)}}}
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

class NewFactRow extends Component {
  state = {
    fact: {
      name: '',
      variable_name: '',
      expression: '',
      values: [],
      errors: [],
    },
  }

  setFactState(newFactState) { this.setState({fact: {...this.state.fact, ...newFactState}}) }
  onChangeName(e) { this.setFactState({name: _.get(e, 'target.value')}) }
  onChangeVariableName(e) { this.setFactState({variable_name: _.get(e, 'target.value')}) }
  onChangeExpression(e) { this.setFactState({expression: _.get(e, 'target.value')}) }

  onBlurExpression() {
    simulateFact(['biz'], this.state.fact).then(({values, errors}) => {this.setFactState({values, errors})})
  }

  isValid() {
    return hasAllNonEmpty(this.state.fact, ['name', 'variable_name', 'expression', 'values']) && _.isEmpty(_.get(this, 'state.fact.errors'))
  }
  onSubmit() { this.props.onSubmit(this.state.fact) }

  render() {
    const buttonClasses = ['ui', 'button', ...(this.isValid() ? [] : ['disabled'])]
    return (
      <div className='Fact new ui form'>
        <div className='row'>
          <div className='col-md-3'>
            <input
              type='text'
              placeholder='Expression'
              value={this.state.fact.expression}
              onChange={this.onChangeExpression.bind(this)}
              onBlur={this.onBlurExpression.bind(this)}
            />
          </div>
          <div className='col-md-6'>
            <input
              type='text'
              placeholder='Name'
              value={this.state.fact.name}
              onChange={this.onChangeName.bind(this)}
            />
          </div>
          <div className='col-md-2'>
            <div className='variableName'>
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
      onSubmit={onAddFact}
    />
  </div>
)
