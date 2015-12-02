import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import './style.css'
import {ButtonClose} from '../buttons/close/index.js'

export default class EditingMode extends Component {
  displayName: 'ClickToEditEditing'

  _submit() {
    const value = this.textInput.value
    this.props.onSubmit(value)
    this.props.onClose()
  }

  render() {
    return(
      <div className='EditingMode'>
        <textarea  defaultValue={this.props.value} ref='input' ref={ (ref) =>
          {
            ref && React.findDOMNode(ref).select();
            this.textInput = ref
          }
        } />
        <div className='submit-section'>
          <div className='submit ui button primary' onClick={this._submit.bind(this)}>
            {this.props.editingSaveText}
          </div>
          <ButtonClose onClick={this.props.onClose}/>
        </div>
      </div>
    )
  }
}

export default class ViewingMode extends Component {
  displayName: 'ClickToEditViewing'

  render() {
    return(
      <div className='ViewingMode'>
        <div className='row'>
          <div className='col-sm-12 header'>
            Description
            <span className='editLink' onClick={this.props.onEdit}>Edit </span>
          </div>
          <div className='col-sm-12 content'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

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

  render() {
    const showEditing = this.state.isEditing
    const showDescription = !showEditing && !_.isEmpty(this.props.value)
    const showAddDescription = !showEditing && !showDescription

    return (
      <span className='ClickToEdit'>
        {showEditing &&
          <EditingMode
            value={this.props.value}
            editingSaveText={this.props.editingSaveText}
            onSubmit={this.props.onSubmit}
            onClose={this._close.bind(this)}
            />
        }

        {showAddDescription &&
          <div className='BlankMode' onClick={this._open.bind(this)}>
            {this.props.emptyValue}
          </div>
        }

        {showDescription &&
          <ViewingMode onEdit={this._open.bind(this)}>
            {this.props.viewing}
          </ViewingMode>
        }
      </span>
    )
  }
}
