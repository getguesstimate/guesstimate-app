import React, {Component} from 'react'
import {connect} from 'react-redux'

import Icon from 'react-fa'

import {simulateFact} from 'gEngine/facts'

import './facts.css'

const FactRow = ({fact}) => (
  <div className='Fact'>
    <div className='row'>
      <div className='col-md-3'> Histogram Placeholder </div>
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
    },
  }

  setFactState(newFactState) { this.setState({fact: {...this.state.fact, ...newFactState}}) }
  onChangeName(e) { this.setFactState({name: _.get(e, 'target.value')}) }
  onChangeVariableName(e) { this.setFactState({variable_name: _.get(e, 'target.value')}) }
  onChangeExpression(e) { this.setFactState({expression: _.get(e, 'target.value')}) }

  onBlurExpression() {
    simulateFact(['biz'], this.state.fact).then(values => {this.setFactState({values})})
  }

  isValid() { return hasAllNonEmpty(this.state.fact, ['name', 'variable_name', 'expression', 'values']) }
  onSubmit() { this.props.onSubmit(this.state.fact) }

  render() {
    const buttonClasses = ['ui', 'button', ...(this.isValid() ? [] : ['disabled'])]
    return (
      <div classNmae='newFact'>
        <div className='row'>
          <div className='col-md-3'>
            <input
              type='text'
              value={this.state.fact.expression}
              onChange={this.onChangeExpression.bind(this)}
              onBlur={this.onBlurExpression.bind(this)}
            />
          </div>
          <div className='col-md-6'>
            <input
              type='text'
              value={this.state.fact.name}
              onChange={this.onChangeName.bind(this)}
            />
          </div>
          <div className='col-md-2'>
            <div className='variableName'>
              <span className='prefix'>#</span>
              <input
                type='text'
                value={this.state.fact.variable_name}
                onChange={this.onChangeVariableName.bind(this)}
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
