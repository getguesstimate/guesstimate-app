import React, {Component, PropTypes} from 'react'

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {isData, formatData} from 'lib/guesstimator/formatter/formatters/Data'
import {getFactParams, addText, addSuggestionToEditorState, findWithRegex, FACT_DECORATOR_LIST} from 'lib/factParser'

const ValidInput = props => <span {...props} className='valid input'>{props.children}</span>
const ErrorInput = props => <span {...props} className='error input'>{props.children}</span>

export default class TextInput extends Component{
  displayName: 'Guesstimate-TextInput'

  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.value || ''),
      new CompositeDecorator(this.decoratorList()),
    ),
    suggestion: {
      text: '',
      suffix: '',
    },
    extraDecorators: [],
    decoratorsUpToDate: false,
  }

  static propTypes = {
    value: PropTypes.string,
  }

  decoratorList() {
    const {validInputs, errorInputs} = this.props

    let decorators = [...(_.get(this, 'state.extraDecorators') || []), ...FACT_DECORATOR_LIST]

    if (!_.isEmpty(validInputs)) {
      const validInputsRegex = new RegExp(`(${validInputs.join('|')})`, 'g')
      decorators.push({
        strategy: (contentBlock, callback) => { findWithRegex(validInputsRegex, contentBlock, callback) },
        component: ValidInput,
      })
    }
    if (!_.isEmpty(errorInputs)) {
      const errorInputsRegex = new RegExp(`(${errorInputs.join('|')})`, 'g')
      decorators.push({
        strategy: (contentBlock, callback) => { findWithRegex(errorInputsRegex, contentBlock, callback) },
        component: ErrorInput,
      })
    }
    return decorators
  }

  focus() { this.refs.editor.focus() }

  insertAtCaret(text) {
    this.onChange(addText(this.state.editorState, text, false))
  }

  replaceAtCaret(text, start, end) {
    this.onChange(addText(this.state.editorState, text, false, start, end))
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.state.decoratorsUpToDate ||
      !_.isEqual(prevState.extraDecorators, this.state.extraDecorators)
    ) {
      this.updateDecorators()
    }
  }

  componentWillUnmount() {
    const selection = this.state.editorState.getSelection()
    if (selection && selection.getHasFocus()) {
      this.handleBlur()
    }
  }

  onChange(editorState) {
    const newState = {
      editorState,
      ...addSuggestionToEditorState(editorState, this.state.suggestion.text)
    }
    this.setState(newState)

    const text = newState.editorState.getCurrentContent().getPlainText('')
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
    this.setState({suggestion: {text: '', suffix: ''}, extraDecorators: [], decoratorsUpToDate: false})
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

  updateDecorators() {
    this.setState({
      editorState: EditorState.set(this.state.editorState, {decorator: new CompositeDecorator(this.decoratorList())}),
      decoratorsUpToDate: true,
    })
  }

  render() {
    const [{hasErrors, width, value, validInputs, errorInputs}, {editorState}] = [this.props, this.state]
    const className = `TextInput ${width}` + (_.isEmpty(value) && hasErrors ? ' hasErrors' : '')
    return (
      <span
        className={className}
        onClick={this.focus.bind(this)}
        onKeyDown={e => {this.setState({decoratorsUpToDate: false}); e.stopPropagation()}}
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
    )
  }
}
