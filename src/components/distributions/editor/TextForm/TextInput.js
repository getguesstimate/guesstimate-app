import React, {Component, PropTypes} from 'react';

import ReactDOM from 'react-dom'
import $ from 'jquery'
import TextArea from 'react-textarea-autosize'

import DistributionSelector from './DistributionSelector'

import insertAtCaret from 'lib/jquery/insertAtCaret'

import {EditorState, Editor, ContentState, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js'

class SimpleEditor extends React.Component {
  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''))
  }

  _onChange(editorState) {
   this.props.onChange(editorState.getCurrentContent().getPlainText(''))
   return this.setState({editorState})
  }

  focus() {
    this.refs.editor.focus()
  }

  render() {
    const {editorState} = this.state;
    return (
      <span onClick={this.focus.bind(this)}>
        <Editor
          editorState={editorState}
          onBlur={this.props.onBlur}
          onChange={this._onChange.bind(this)}
          tabIndex={2}
          ref='editor'
          placeholder={this.props.placeholder}
        />
      </span>
    );
  }
}

export default class TextInput extends Component{
  displayName: 'GuesstimateForm-TextInput'

  static propTypes = {
    value: PropTypes.string,
  }

  componentWillUnmount() { this._handleBlur() }

  focus() { this.refs.input && this.refs.input.focus() }

  _handleInputMetricClick(item){
    insertAtCaret('live-input', item.readableId)
    //this._changeInput();
  }

  _handleFocus() {
    $(window).on('functionMetricClicked', (a, item) => {this._handleInputMetricClick(item)})
    this.props.onFocus()
  }

  _handleBlur() {
    $(window).off('functionMetricClicked')
    this.props.onBlur()
  }

  _handleChange(value) {
    if (this._isData(value)) {
      const data = this._formatData(value)
      this.props.onChangeData(data)
    } else {
      this._changeInput(value);
    }
    event.stopPropagation()
  }

  _changeInput(value){ this.props.onChange(value) }

  _formatData(value) {
    return value
          .replace(/[\[\]]/g, '')
          .split(/[\n\s,]+/)
          .filter(e => !_.isEmpty(e))
          .map(Number)
          .filter(e => _.isFinite(e))
          .slice(0, 10000)
  }

  //TODO: It would be nice to eventually refactor this to use guesstimator lib
  _isData(input) {
    const isFunction = input.includes('=')
    const count = (input.match(/[\n\s,]/g) || []).length
    return !isFunction && (count > 3)
  }

  _onKeyDown(e) {
    e.stopPropagation()
    if (e.which === 27 || e.which === 13) {
      this.props.onEscape()
    }
  }

  render() {
    const {hasErrors, width} = this.props
    let className = (this.props.value !== '' && hasErrors) ? 'input hasErrors' : 'input'
    className += ` ${width}`
    return (
      <span onKeyDown={this._onKeyDown.bind(this)}
        id='live-input'
        className='wonderwall'
      >
        <SimpleEditor
          onBlur={this._handleBlur.bind(this)}
          onChange={this._handleChange.bind(this)}
          value={this.props.value}
          placeholder={'value'}
          ref='input'
        />
      </span>
    )
  }
}
