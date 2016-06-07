import React, {Component} from 'react'
import {connect} from 'react-redux'

import {create} from 'gModules/organizations/actions'

@connect()
export class CreateOrganizationForm extends Component {
  state = {
    value: ""
  }

  render() {
    return (
      <div className='ui form'>
        <div class='field'>
          <label>Organization Name</label>
          <input
            placeholder={"name"}
            value={this.state.value}
            onChange={(e) => {this.setState({value: e.target.value})}}
          />
        </div>
        <div
          className="ui button submit blue"
          onClick={() => { this.props.dispatch(create(this.state.value)) }}
        >
          Submit
        </div>
      </div>
    )
  }
}
