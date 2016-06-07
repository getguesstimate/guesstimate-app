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
        <div>
          <input
            placeholder={"name"}
            value={this.state.value}
            onChange={(e) => {this.setState({value: e.target.value})}}
          />
        </div>
        <div>
          <span
            className="ui button primary"
            onClick={() => {
              this.props.dispatch(create(this.state.value))
            }}
          >
            Submit
          </span>
        </div>
      </div>
    )
  }
}
