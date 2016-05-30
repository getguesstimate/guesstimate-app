import React, {Component, PropTypes} from 'react';

import ReactDOM from 'react-dom'
import $ from 'jquery'
import {EditorState, Editor, ContentState, getDefaultKeyBinding, KeyBindingUtil, Modifier} from 'draft-js'

import DistributionSelector from './DistributionSelector'

class TextInputEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''))
  }

  insertAtCaret(text) {
    const {editorState} = this.state
    const selection = editorState.getSelection()
    const content = editorState.getCurrentContent()
    const newContentState = Modifier.insertText(content, selection, text)
    const newEditorState = EditorState.push(editorState, newContentState, 'paste')
    this._onChange(newEditorState)
  }

  focus() {
    this.refs.editor.focus()
  }

  _text(editorState) {
    return editorState.getCurrentContent().getPlainText('')
  }

  _onChange(editorState) {
    this.props.onChange(editorState.getCurrentContent().getPlainText(''))
    return this.setState({editorState})
  }

  handleReturn(e) {
    if (e.shiftKey) {
      return false
    } else {
      this.props.handleReturn()
      return true
    }
  }

  render() {
    const {editorState} = this.state;
    return (
      <span
        className={this.props.className}
        onClick={this.focus.bind(this)}
        onKeyDown={this.props.onKeyDown}
        onFocus={this.props.onFocus}
      >
        <Editor
          onFocus={this.props.onFocus}
          editorState={editorState}
          handleReturn={this.handleReturn.bind(this)}
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
  displayName: 'Guesstimate-TextInput'

  static propTypes = {
    value: PropTypes.string,
  }

  componentWillUnmount() { this._handleBlur() }

  focus() { this.refs.editor && this.refs.editor.focus() }

  _handleInputMetricClick(item){
    this.refs.editor.insertAtCaret(item.readableId)
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
    if (value !== this.props.value) {
      if (this._isData(value)) {
        const data = this._formatData(value)
        this.props.onChangeData(data)
      } else {
        this._changeInput(value);
      }
    }
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
  }

  render() {
    const {hasErrors, width} = this.props
    let className = 'TextInput'
    className += (this.props.value !== '' && hasErrors) ? ' hasErrors' : ''
    className += ` ${width}`
    return (
      <TextInputEditor
        className={className}
        onBlur={this._handleBlur.bind(this)}
        onChange={this._handleChange.bind(this)}
        onFocus={this._handleFocus.bind(this)}
        onKeyDown={this._onKeyDown.bind(this)}
        handleReturn={this.props.onEscape}
        value={this.props.value}
        placeholder={'value'}
        ref='editor'
      />
    )
  }
}
