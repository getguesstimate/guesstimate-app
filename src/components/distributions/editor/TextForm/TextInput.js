import React, {Component, PropTypes} from 'react';

import ReactDOM from 'react-dom'
import $ from 'jquery'
import TextArea from 'react-textarea-autosize'

import DistributionSelector from './DistributionSelector'

import {EditorState, Editor, ContentState, getDefaultKeyBinding, KeyBindingUtil, Modifier} from 'draft-js'

class SimpleEditor extends React.Component {
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
    let className = 'TextInput'
    className += (this.props.value !== '' && hasErrors) ? 'hasErrors' : ''
    className += ` ${width}`
    return (
      <SimpleEditor
        className={className}
        onBlur={this._handleBlur.bind(this)}
        onChange={this._handleChange.bind(this)}
        onFocus={this._handleFocus.bind(this)}
        onKeyDown={this._onKeyDown.bind(this)}
        value={this.props.value}
        placeholder={'value'}
        ref='editor'
      />
    )
  }
}
