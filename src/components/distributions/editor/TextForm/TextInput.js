import React, {Component, PropTypes} from 'react'

let count = 0

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {isData, formatData} from 'lib/guesstimator/formatter/formatters/Data'
import {getFactParams, addText} from 'lib/factParser'

const NOUN_REGEX = /(\@[\w]+)/g
const PROPERTY_REGEX = /[a-zA-Z_](\.[\w]+)/g

const positionDecorator = (start, end, component) => ({strategy: (contentBlock, callback) => {callback(start, end)}, component})

const NounSpan = props => <span {...props} className='noun'>{props.children}</span>
const PropertySpan = props => <span {...props} className='property'>{props.children}</span>
const SuggestionSpan = props => <span {...props} className='suggestion'>{props.children}</span>

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index + matchArr[0].indexOf(matchArr[1])
    callback(start, start + matchArr[1].length)
  }
}

const STATIC_DECORATOR_LIST = [
  {
    strategy: (contentBlock, callback) => { findWithRegex(NOUN_REGEX, contentBlock, callback) },
    component: NounSpan,
  },
  {
    strategy: (contentBlock, callback) => { findWithRegex(PROPERTY_REGEX, contentBlock, callback) },
    component: PropertySpan,
  },
]
const STATIC_DECORATOR = {decorator: new CompositeDecorator(STATIC_DECORATOR_LIST)}

export default class TextInput extends Component{
  displayName: 'Guesstimate-TextInput'

  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''), new CompositeDecorator(STATIC_DECORATOR_LIST)),
    suggestion: '',
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
      this.props.onBlur()
    }
  }

  withSuggestion(baseEditorState, precedingPartial, suggestion, nextWord, decoratorComponent) {
    const nextWordSuitable = (nextWord || '') === (this.state.suggestion || '') || (nextWord || '') === (suggestion || '')
    const hasPartialAndSuggestion = !(_.isEmpty(precedingPartial) || _.isEmpty(suggestion))
    if (!(hasPartialAndSuggestion && nextWordSuitable)) { return {} }

    const cursorPosition = baseEditorState.getSelection().getFocusOffset()
    const decorator = new CompositeDecorator([
      positionDecorator(cursorPosition-precedingPartial.length-1, cursorPosition, decoratorComponent),
      positionDecorator(cursorPosition, cursorPosition+suggestion.length, SuggestionSpan),
      ...STATIC_DECORATOR_LIST
    ])

    let editorState
    if (nextWordSuitable) {
      editorState = addText(baseEditorState, suggestion, true, cursorPosition, cursorPosition+nextWord.length-1)
    } else if (_.isEmpty(this.state.suggestion)) {
      editorState = addText(baseEditorState, suggestion)
    } else {
      editorState = addText(baseEditorState, suggestion, true, cursorPosition, cursorPosition+suggestion.length)
    }
    return {editorState: EditorState.set(editorState, {decorator}), suggestion}
  }


  suggestionState(editorState, prevWord, nextWord, cursorPosition) {
    const {propertyIndex, partialProperty, partialNoun, suggestion} = getFactParams(prevWord)

    if (_.isEmpty(suggestion) && !_.isEmpty(this.state.suggestion) && nextWord === this.state.suggestion) {
      const noSuggestion = addText(editorState, '', true, cursorPosition, cursorPosition + this.state.suggestion.length)
      return {editorState: EditorState.set(noSuggestion, STATIC_DECORATOR)}
    } else if (prevWord.includes('.')) {
      return {isNoun: false, ...this.withSuggestion(editorState, partialProperty, suggestion, nextWord, PropertySpan)}
    } else {
      return {isNoun: true, ...this.withSuggestion(editorState, partialNoun, suggestion, nextWord, NounSpan)}
    }

  }

  onChange(editorState) {
    console.log('called onChange', count += 1, 'times')
    let newState = {
      suggestion: '',
      editorState: EditorState.set(editorState, STATIC_DECORATOR),
    }

    const text = editorState.getCurrentContent().getPlainText('')

    const selection = editorState.getSelection()
    const cursorPosition = selection.getFocusOffset()
    const prevWord = text.slice(0, cursorPosition).split(/[^\w@\.]/).pop()

    if (prevWord.startsWith('@') && selection.isCollapsed()) {
      const nextWord = text.slice(cursorPosition).split(/[^\w]/)[0]
      Object.assign(newState, this.suggestionState(editorState, prevWord, nextWord, cursorPosition))
    }

    this.setState(newState)
    const newText = newState.editorState.getCurrentContent().getPlainText('')
    if (newText !== this.props.value) {
      if (isData(newText)) {
        this.props.onChangeData(formatData(newText))
      } else {
        this.props.onChange(newText)
      }
    }
  }

  handleTab(e){
    const {suggestion, isNoun} = this.state

    if (!_.isEmpty(suggestion)) {
      const cursorPosition = this.state.editorState.getSelection().getFocusOffset()
      this.replaceAtCaret(suggestion + (isNoun ? '.' : ''), cursorPosition, cursorPosition+suggestion.length - 1)
    } else {
      this.props.onTab(e.shiftKey)
    }
    this.setState({suggestion: ''})
    e.preventDefault()
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
    const [{hasErrors, width, value}, {editorState}] = [this.props, this.state]
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
