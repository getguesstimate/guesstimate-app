import React, {Component, PropTypes} from 'react'

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {isData, formatData} from 'lib/guesstimator/formatter/formatters/Data'
import {getFactParams, addText, addSuggestionToEditorState, STATIC_DECORATOR, STATIC_DECORATOR_LIST} from 'lib/factParser'

export default class TextInput extends Component{
  displayName: 'Guesstimate-TextInput'

  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''), new CompositeDecorator(STATIC_DECORATOR_LIST)),
    suggestion: {
      text: '',
      suffix: '',
    },
  }

  static propTypes = {
    value: PropTypes.string,
  }

  focus() { this.refs.editor.focus() }

  insertAtCaret(text) {
    this.onChange(EditorState.set(addText(this.state.editorState, text, false), STATIC_DECORATOR))
  }

  replaceAtCaret(text, start, end) {
    this.onChange(EditorState.set(addText(this.state.editorState, text, false, start, end), STATIC_DECORATOR))
  }

  componentWillUnmount() {
    const selection = this.state.editorState.getSelection()
    if (selection && selection.getHasFocus()) {
      this.handleBlur()
    }
  }

  onChange(editorState) {
    const newState = {
      editorState: EditorState.set(editorState, STATIC_DECORATOR),
      ...addSuggestionToEditorState(editorState, this.state.suggestion.text)
    }
    this.setState(newState)

    const text = newState.editorState.getCurrentContent().getPlainText('').trim()
    if (text === this.props.value) { return }
    if (isData(text)) {
      this.props.onChangeData(formatData(text))
    } else {
      this.props.onChange(text)
    }
  }

  handleTab(e){
    if (!_.isEmpty(this.state.suggestion.text)) { this.acceptSuggestion() }
    else { this.props.onTab(e.shiftKey) }
    e.preventDefault()
  }

  acceptSuggestion(){
    const {text, suffix} = this.state.suggestion
    const cursorPosition = this.cursorPosition()
    this.replaceAtCaret(`${text}${suffix}`, cursorPosition, cursorPosition + text.length - 1)
    this.setState({suggestion: {text: '', suffix: ''}})
  }

  cursorPosition(editorState = this.state.editorState) { return editorState.getSelection().getFocusOffset() }

  handleFocus() {
    $(window).on('functionMetricClicked', (_, {readableId}) => {this.insertAtCaret(readableId)})
    this.props.onFocus()
  }

  handleBlur() {
    $(window).off('functionMetricClicked')
    this.props.onBlur()
  }

  render() {
    const [{errors, width, value}, {editorState}] = [this.props, this.state]
    const hasErrors = !_.isEmpty(errors)
    const className = `TextInput ${width}` + (!_.isEmpty(value) && hasErrors ? ' hasErrors' : '')
    return (
      <div>
        <span
          className={className}
          onClick={this.focus.bind(this)}
          onKeyDown={e => {e.stopPropagation()}}
          onFocus={this.handleFocus.bind(this)}
        >
          <Editor
            onFocus={this.props.onFocus}
            onEscape={this.props.onEscape}
            editorState={editorState}
            handleReturn={e => this.props.onReturn(e.shiftKey)}
            onTab={this.handleTab.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            ref='editor'
            placeholder={'value'}
          />
        </span>
      </div>
    )
  }
}
