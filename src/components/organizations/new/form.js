import React, {Component} from 'react'
import {connect} from 'react-redux'

import {create} from 'gModules/organizations/actions'
import Card, {CardListElement} from 'gComponents/utility/card/index'

@connect()
export class CreateOrganizationForm extends Component {
  state = {
    value: ""
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
            <p>By creating this organization, you will be the administrator of it.</p>
          </div>
        </div>
      </div>
    )
  }
}
