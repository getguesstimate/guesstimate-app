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
      <div className="organization-form">
        <h1>Create a new organization</h1>
        <input
          value={this.state.value}
          onChange={(e) => {this.setState({value: e.target.value})}}
        />
        <br/>
        <span
          className="button"
          onClick={() => {
            this.props.dispatch(create(this.state.value))
          }}
        >
          Submit
        </span>
      </div>
    )
  }
}
