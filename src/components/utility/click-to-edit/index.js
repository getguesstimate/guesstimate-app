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
    const value = this.textInput.value
    this.props.onSubmit(value)
    this._close()
  }

  render() {
    let className = 'click-to-edit'
    className += this.state.isEditing ? ' editing' : ' viewing'
    return (
      <span className={className} onClick={!this.state.isEditing && this._open.bind(this)}>
        {this.state.isEditing &&
          <textarea  defaultValue={this.props.value} ref='input' ref={ (ref) =>
            {
              ref && React.findDOMNode(ref).select();
              this.textInput = ref
            }
          } />
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
          (_.isEmpty(this.props.value) ? this.props.emptyValue : this.props.viewing)
        }
      </span>
    )
  }
}
