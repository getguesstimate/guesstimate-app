import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {clearSuggestion, globalsSearch} from 'gModules/factBank/actions'

import {isData, formatData} from 'lib/guesstimator/formatter/formatters/Data'
import {getFactParams, addText, addSuggestionToEditorState, findWithRegex, FACT_DECORATOR_LIST, positionDecorator, NounSpan, PropertySpan, SuggestionSpan} from 'lib/factParser'

const ValidInput = props => <span {...props} className='valid input'>{props.children}</span>
const ErrorInput = props => <span {...props} className='error input'>{props.children}</span>

function mapStateToProps(state) {
  return { suggestion: state.factBank.currentSuggestion }
}

@connect(mapStateToProps)
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

  insertAtCaret(text) {
    this.onChange(addText(this.state.editorState, text, false))
  }

  stripExtraDecorators(editorState) { return this.withExtraDecorators(editorState, []) }
  withExtraDecorators(editorState, extraDecorators) {
    return EditorState.set(editorState, {decorator: new CompositeDecorator(this.decoratorList(extraDecorators))})
  }

  deleteOldSuggestion(oldSuggestion) {
    const freshEditorState = addText(this.state.editorState, '', true, this.cursorPosition(), this.cursorPosition() + oldSuggestion.length)
    this.setState({editorState: this.stripExtraDecorators(freshEditorState)})
  }

  addSuggestion() {
    const partial = this.prevWord().slice(1).split('.').pop()
    const inProperty = this.prevWord().includes('.')

    const decoratorComponent = inProperty ? PropertySpan : NounSpan
    const extraDecorators = [
      positionDecorator(this.cursorPosition() - partial.length - 1, this.cursorPosition(), decoratorComponent),
      positionDecorator(this.cursorPosition(), this.cursorPosition() + this.props.suggestion.length, SuggestionSpan),
    ]

    const addedEditorState = addText(this.state.editorState, this.props.suggestion, true, this.cursorPosition(), this.cursorPosition()+this.nextWord().length-1)

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
    return this.text(editorState).slice(0, this.cursorPosition(editorState)).split(/[^\w@\.]/).pop()
  }

  fetchSuggestion(editorState) {
    const prevWord = this.prevWord(editorState)
    if (!(prevWord.startsWith('@') && editorState.getSelection().isCollapsed())) {
      if (!_.isEmpty(this.props.suggestion)) { this.props.dispatch(clearSuggestion()) }
    } else {
      this.props.dispatch(globalsSearch(prevWord.slice(1).split('.')))
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
    if (!_.isEmpty(this.props.suggestion)) { this.acceptSuggestion() }
    else { this.props.onTab(e.shiftKey) }
    e.preventDefault()
  }

  acceptSuggestion(){
    const inProperty = this.prevWord().includes('.')
    const cursorPosition = this.cursorPosition()
    const addedEditorState = addText(this.state.editorState, `${this.props.suggestion}${inProperty ? '' : '.'}`, false, cursorPosition, cursorPosition + this.props.suggestion.length - 1)
    this.onChange(this.stripExtraDecorators(addedEditorState))
  }

  handleFocus() {
    $(window).on('functionMetricClicked', (_, {readableId}) => {this.insertAtCaret(readableId)})
    this.props.onFocus()
  }

  handleBlur() {
    $(window).off('functionMetricClicked')
    this.props.onBlur()
  }

  render() {
    const [{hasErrors, width, value, validInputs, errorInputs}, {editorState}] = [this.props, this.state]
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
