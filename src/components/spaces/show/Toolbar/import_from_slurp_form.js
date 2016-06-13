import React, {Component} from 'react'

import ReactDOM from 'react-dom'
import Icon from 'react-fa'

import e from 'gEngine/engine'

import * as elev from 'server/elev/index'

import './style.css'

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

  isValid() {
    try {
      JSON.parse(this.state.value)
      return true
    } catch (e) {
      return false
    }
  }

  render() {
    return (
      <div className='ImportFromSlurpForm'>
        <h2> Import SLURP </h2>
        <div className='SlurpQuestionLink' onClick={() => {elev.open(elev.SIPS_AND_SLURPS)}}>
          <Icon name='question-circle'/>
        </div>
        <div className='ui form'>
          <div className='field'>
            <textarea
              value={this.state.value}
              onChange={(e) => {this.setState({value: e.target.value})}}
              tabIndex='2'
              ref='textarea'
            />
          </div>
          <div
            className={`ui button submit ${this.isValid() ? 'blue' : 'inactive'}`}
            onClick={this.onSubmit.bind(this)}
          >
            Import
          </div>
        </div>
      </div>
    )
  }
}
