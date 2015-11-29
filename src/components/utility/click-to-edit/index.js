import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import './style.css'
import {ButtonClose} from '../buttons/close/index.js'

export default class ClickToEdit extends Component {
  displayName: 'ClickToEdit'


  constructor(props) {
    super(props);

    this.state = {
      isEditing: props.isEditing || false
    }
  }

  _open() {
    this.setState({isEditing: true})
  }

  _close() {
    this.setState({isEditing: false})
  }

  _toggle() {
    this.state.isOpen ? this._close() : this._open()
  }

  _submit() {
    const value = this.refs.input.value
    this.props.onSubmit(value)
    this._close()
  }

  render() {
    let className = 'click-to-edit'
    className += this.state.isEditing ? ' editing' : ' viewing'
    return (
      <span className={className}>
        {this.state.isEditing &&
          <textarea ref='input' defaultValue={this.props.value}/>
        }
        {this.state.isEditing &&
          <div className='submit-section'>
            <div className='submit ui button primary' onClick={this._submit.bind(this)}>
              {this.props.editingSaveText}
            </div>
            <ButtonClose onClick={this._close.bind(this)}/>
          </div>
        }
        {!this.state.isEditing &&
          <span onClick={this._open.bind(this)}>
            {this.props.viewing}
          </span>
        }
      </span>
    )
  }
}
