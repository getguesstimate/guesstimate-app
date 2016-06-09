import React, {Component} from 'react'
import {connect} from 'react-redux'

import {create} from 'gModules/organizations/actions'
import Card, {CardListElement} from 'gComponents/utility/card/index'

export class PlanElement extends Component {
  render() {
    return(
      <div className={`PlanElement ${this.props.isSelected && 'selected'}`} onClick={this.props.onClick}>
        <div className='radio-section'>
          <input type='radio' checked={this.props.isSelected}/>
        </div>
        <div className='content-section'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export class PlanList extends Component {
  render() {
    return(
      <div className='PlanList'>
        <PlanElement onClick={() => {this.props.onSelect('FREE')}} isSelected={this.props.plan === 'FREE'}>
          Unlimited members and public models for free.
        </PlanElement>
        <PlanElement onClick={() => {this.props.onSelect('PREMIUM')}} isSelected={this.props.plan === 'PREMIUM'}>
          Unlimited private models. $12/month per user.
          <div className='free-trial'>Free 14-day trial, no credit card needed.</div>
        </PlanElement>
      </div>
    )
  }
}

@connect()
export class CreateOrganizationForm extends Component {
  state = {
    value: '',
    plan: 'PREMIUM'
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
              onClick={() => { this.props.dispatch(create(this.state.value)) }}
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
