import React, {Component} from 'react'

import e from 'gEngine/engine'

export class ImportFromSlurpForm extends Component {
  state = {
    value: ""
  }

  onSubmit() {
    this.props.onSubmit(JSON.parse(this.state.value).SLURP)
  }

  render() {
    return (
      <div className='ui form'>
        <div className='field'>
          <label>JSON Slurp</label>
          <textarea
            value={this.state.value}
            onChange={(e) => {this.setState({value: e.target.value})}}
          />
        </div>
        <div
          className='ui button submit blue'
          onClick={this.onSubmit.bind(this)}
        >
          Import
        </div>
      </div>
    )
  }
}
