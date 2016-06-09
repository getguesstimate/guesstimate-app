import React, {Component} from 'react'

import ReactDOM from 'react-dom'

import e from 'gEngine/engine'

export class ImportFromSlurpForm extends Component {
  state = {
    value: ""
  }

  componentDidMount() {
    // TODO(Ozzie): Ozzie, any idea how to get this to focus? I can't seem to...
    this.refs.textarea.focus()
    ReactDOM.findDOMNode(this.refs.textarea).focus()
  }

  onSubmit() {
    this.props.onSubmit(JSON.parse(this.state.value))
  }

  render() {
    return (
      <div className='ui form'>
        <div className='field'>
          <label>JSON Slurp</label>
          <textarea
            value={this.state.value}
            onChange={(e) => {this.setState({value: e.target.value})}}
            tabIndex='2'
            ref='textarea'
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
