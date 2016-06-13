import React, {Component} from 'react'
import {connect} from 'react-redux'

import Card, {CardListElement} from 'gComponents/utility/card/index'

import {create} from 'gModules/organizations/actions'

export const PlanElement = ({onClick, isSelected, children}) => (
  <div className={`PlanElement ${isSelected && 'selected'}`} onClick={onClick}>
    <div className='radio-section'>
      <input type='radio' checked={isSelected}/>
    </div>
    <div className='content-section'>
      {children}
    </div>
  </div>
)

export const PlanList = ({onSelect, plan}) => (
  <div className='PlanList'>
    <PlanElement onClick={() => {onSelect('FREE')}} isSelected={plan === 'FREE'}>
      Unlimited members and public models for free.
    </PlanElement>
    <PlanElement onClick={() => {onSelect('PREMIUM')}} isSelected={plan === 'PREMIUM'}>
      Unlimited private models. $12/month per user.
      <div className='free-trial'>Free 14-day trial, no credit card needed.</div>
    </PlanElement>
  </div>
)

@connect()
export class CreateOrganizationForm extends Component {
  state = {
    value: '',
    plan: 'PREMIUM',
  }

  _onSubmit() {
    const newOrganization = {
      name: this.state.value,
      plan: (this.state.plan === 'PREMIUM' ? 6 : 5)
    }
    this.props.dispatch(create(newOrganization))
  }

  render() {
    return (
      <div className='row'>
        <div className='col-sm-7'>
          <div className='ui form'>
            <div className='field name'>
              <label>Organization Name</label>
              <input
                placeholder={'name'}
                value={this.state.value}
                onChange={(e) => {this.setState({value: e.target.value})}}
              />
            </div>

            <div className='field plan'>
              <label>Plan</label>
              <PlanList plan={this.state.plan} onSelect={(plan) => {this.setState({plan})}}/>
            </div>
            <div
              className='ui button submit green'
              onClick={this._onSubmit.bind(this)}
            >
              Create Organization
            </div>
          </div>
        </div>

        <div className='col-sm-1'/>
        <div className='col-sm-4'>
          <div className='ui message'>
            <h3> Organizations </h3>
            <p>Share & collaborate on models with a group you trust.</p>
          </div>
        </div>
      </div>
    )
  }
}
