import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {clearSuggestion, getSuggestion} from 'gModules/facts/actions'

import {HANDLE_REGEX, resolveToSelector} from 'gEngine/facts'

import {isData, formatData} from 'lib/guesstimator/formatter/formatters/Data'

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

const stylizedSpan = className => props => <span {...props} className={className}>{props.children}</span>
const Fact = stylizedSpan('fact input')
const Suggestion = stylizedSpan('suggestion')
const ValidInput = stylizedSpan('valid input')
const ErrorInput = stylizedSpan('error input')

const FACT_DECORATOR_LIST = [
  {
    strategy: (contentBlock, callback) => { findWithRegex(HANDLE_REGEX, contentBlock, callback) },
    component: Fact,
  },
]

const positionDecorator = (start, end, component) => ({
  strategy: (contentBlock, callback) => {if (end <= contentBlock.text.length) {callback(start, end)}},
  component,
})

@connect(state => ({suggestion: state.facts.currentSuggestion}))
export class TextInput extends Component{
  displayName: 'Guesstimate-TextInput'

  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.value || ''),
      new CompositeDecorator(this.decoratorList()),
    ),
  }

  static propTypes = {
    value: PropTypes.string,
  }

  decoratorList(extraDecorators=[]) {
    const {validInputs, errorInputs} = this.props

    let decorators = [...extraDecorators, ...FACT_DECORATOR_LIST]

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

  addText(text, maintainCursorPosition = true, replaceLength = 0) {
    const selection = this.state.editorState.getSelection()
    const content = this.state.editorState.getCurrentContent()

    let baseEditorState
    if (replaceLength > 0) {
      const replaceSelection = selection.merge({anchorOffset: this.cursorPosition(), focusOffset: this.cursorPosition() + replaceLength})
      baseEditorState = EditorState.push(this.state.editorState, Modifier.replaceText(content, replaceSelection, text), 'paste')
    } else {
      baseEditorState = EditorState.push(this.state.editorState, Modifier.insertText(content, selection, text), 'paste')
    }

    if (!maintainCursorPosition) { return baseEditorState }

    const cursorPosition = selection.getFocusOffset()
    const newSelectionState = selection.merge({focusOffset: cursorPosition})
    return EditorState.forceSelection(baseEditorState, newSelectionState)
  }

  stripExtraDecorators(editorState) { return this.withExtraDecorators(editorState, []) }
  withExtraDecorators(editorState, extraDecorators) {
    return EditorState.set(editorState, {decorator: new CompositeDecorator(this.decoratorList(extraDecorators))})
  }

  deleteOldSuggestion(oldSuggestion) {
    const freshEditorState = this.addText('', true, oldSuggestion.length)
    this.setState({editorState: this.stripExtraDecorators(freshEditorState)})
  }

  addSuggestion() {
    const partial = resolveToSelector(this.props.organizationId)(this.prevWord()).pop()

    const extraDecorators = [
      positionDecorator(this.cursorPosition() - this.prevWord().length - 1, this.cursorPosition(), Fact),
      positionDecorator(this.cursorPosition(), this.cursorPosition() + this.props.suggestion.length, Suggestion),
    ]

    const addedEditorState = this.addText(this.props.suggestion, true, this.nextWord().length)

    this.setState({editorState: this.withExtraDecorators(addedEditorState, extraDecorators)})
  }

  componentDidUpdate(prevProps) {
    if (this.props.suggestion !== prevProps.suggestion && this.nextWord() === prevProps.suggestion) {
      if (_.isEmpty(this.props.suggestion)) {
        this.deleteOldSuggestion(prevProps.suggestion)
      } else {
        this.addSuggestion()
      }
    }
  }

  componentWillUnmount() {
    const selection = this.state.editorState.getSelection()
    if (selection && selection.getHasFocus()) {
      this.handleBlur()
    }
  }

  cursorPosition(editorState = this.state.editorState) { return editorState.getSelection().getFocusOffset() }
  text(editorState = this.state.editorState) { return editorState.getCurrentContent().getPlainText('') }
  nextWord(editorState = this.state.editorState) {
    return this.text(editorState).slice(this.cursorPosition(editorState)).split(/[^\w]/)[0]
  }
  prevWord(editorState = this.state.editorState) {
    return this.text(editorState).slice(0, this.cursorPosition(editorState)).split(/[^\w@#\.]/).pop()
  }

  fetchSuggestion(editorState) {
    const prevWord = this.prevWord(editorState)
    if (editorState.getSelection().isCollapsed() && (HANDLE_REGEX.test(prevWord))) {
      this.props.dispatch(getSuggestion(resolveToSelector(this.props.organizationId)(prevWord)))
    } else {
      if (!_.isEmpty(this.props.suggestion)) { this.props.dispatch(clearSuggestion()) }
    }
  }

  onChange(editorState) {
    this.fetchSuggestion(editorState)
    this.setState({editorState})

    const text = this.text(editorState)
    if (text !== this.props.value) {
      isData(text) ? this.props.onChangeData(formatData(text)) : this.props.onChange(text)
    }
  }

  handleTab(e){
    if (!_.isEmpty(this.props.suggestion) && this.nextWord() === this.props.suggestion) { this.acceptSuggestion() }
    else { this.props.onTab(e.shiftKey) }
    e.preventDefault()
  }

  acceptSuggestion(){
    const suffix = this.prevWord().startsWith('@') && !this.prevWord().includes('.') ? '.' : ''
    const cursorPosition = this.cursorPosition()
    const addedEditorState = this.addText(`${this.props.suggestion}${suffix}`, false, this.props.suggestion.length)
    this.onChange(this.stripExtraDecorators(addedEditorState))
  }

  handleFocus() {
    $(window).on('functionMetricClicked', (_, {readableId}) => {this.onChange(this.addText(readableId, false))})
    this.props.onFocus()
  }

  handleBlur() {
    $(window).off('functionMetricClicked')
    this.props.onBlur()
  }

  render() {
    const [{hasErrors, width, value, validInputs}, {editorState}] = [this.props, this.state]
    const className = `TextInput ${width}` + (_.isEmpty(value) && hasErrors ? ' hasErrors' : '')
    return (
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
    )
  }
}
