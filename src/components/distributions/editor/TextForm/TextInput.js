import React, {Component, PropTypes} from 'react'

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {isData, formatData} from 'lib/guesstimator/formatter/formatters/Data'

import {nounSearch, propertySearch} from 'gModules/factBank/actions'

const NOUN_REGEX = /(\@[\w]+)/g
const PROPERTY_REGEX = /[a-zA-Z_](\.[\w]+)/g

const positionDecorator = (start, end, component) => ({strategy: (contentBlock, callback) => {callback(start, end)}, component})

const NounSpan = props => <span {...props} className='noun'>{props.children}</span>
const PropertySpan = props => <span {...props} className='property'>{props.children}</span>
const SuggestionSpan = props => <span {...props} className='suggestion'>{props.children}</span>

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

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index + matchArr[0].indexOf(matchArr[1])
    callback(start, start + matchArr[1].length)
  }
}

function getPropertyParams(prevWord) {
  const noun = prevWord.slice(1, prevWord.indexOf('.'))
  const propertyIndex = prevWord.indexOf('.') + 1
  const partialProperty = prevWord.slice(propertyIndex)
  const possibleProperties = propertySearch(noun, partialProperty)
  const suggestion = _.isEmpty(partialProperty) || _.isEmpty(possibleProperties) ? '' : possibleProperties[0].replace(partialProperty, '')
  return {propertyIndex, partialProperty, suggestion}
}

function getNounParams(prevWord) {
  const partialNoun = prevWord.slice(1)
  const possibleNouns = nounSearch(partialNoun)
  const suggestion = _.isEmpty(partialNoun) || _.isEmpty(possibleNouns) ? '' : possibleNouns[0].replace(partialNoun, '')
  return {partialNoun, suggestion}
}

function getFactBankParams(prevWord) {
  return prevWord.includes('.') ? getPropertyParams(prevWord) : getNounParams(prevWord)
}

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

  getReplacedEditorState(editorState, text, [anchorOffset, focusOffset], maintainCursorPosition = true) {
    const selection = editorState.getSelection()
    const content = editorState.getCurrentContent()
    const newContentState = Modifier.replaceText(content, selection.merge({anchorOffset, focusOffset: focusOffset + 1}), text)

    const baseEditorState = EditorState.push(editorState, newContentState, 'paste')

    if (!maintainCursorPosition) { return baseEditorState }

    const cursorPosition = selection.getFocusOffset()
    const newSelectionState = selection.merge({focusOffset: cursorPosition})
    return EditorState.forceSelection(baseEditorState, newSelectionState)
  }

  getInsertedEditorState(editorState, text, maintainCursorPosition = true) {
    const selection = editorState.getSelection()
    const content = editorState.getCurrentContent()
    const newContentState = Modifier.insertText(content, selection, text)

    const baseEditorState = EditorState.push(editorState, newContentState, 'paste')

    if (!maintainCursorPosition) { return baseEditorState }

    const cursorPosition = selection.getFocusOffset()
    const newSelectionState = selection.merge({focusOffset: cursorPosition})
    return EditorState.forceSelection(baseEditorState, newSelectionState)
  }

  insertAtCaret(text) {
    this.onChange(EditorState.set(this.getInsertedEditorState(this.state.editorState, text, false), STATIC_DECORATOR))
  }

  replaceAtCaret(text, start, end) {
    this.onChange(EditorState.set(this.getReplacedEditorState(this.state.editorState, text, [start, end], false), STATIC_DECORATOR))
  }

  componentWillUnmount() {
    const selection = this.state.editorState.getSelection()
    if (selection && selection.getHasFocus()) {
      this.props.onBlur()
    }
  }

  withSuggestion(editorState, precedingPartial, suggestion, nextWord, partialLength, decoratorComponent) {
    const nextWordSuitable = (nextWord || '') === (this.state.suggestion || '') || (nextWord || '') === (suggestion || '')
    const hasPartialAndSuggestion = !(_.isEmpty(precedingPartial) || _.isEmpty(suggestion))
    if (!(hasPartialAndSuggestion && nextWordSuitable)) { return {} }

    const cursorPosition = editorState.getSelection().getFocusOffset()
    const decorator = new CompositeDecorator([
      positionDecorator(cursorPosition-partialLength-1, cursorPosition, decoratorComponent),
      positionDecorator(cursorPosition, cursorPosition+suggestion.length, SuggestionSpan),
      ...STATIC_DECORATOR_LIST
    ])
    if ((nextWord || '') === (suggestion || '')) {
      return {editorState: EditorState.set(this.getReplacedEditorState(editorState, suggestion, [cursorPosition, cursorPosition+nextWord.length]), {decorator}), suggestion}
    } else if (_.isEmpty(this.state.suggestion)) {
      return {editorState: EditorState.set(this.getInsertedEditorState(editorState, suggestion), {decorator}), suggestion}
    } else {
      return {editorState: EditorState.set(this.getReplacedEditorState(editorState, suggestion, [cursorPosition, cursorPosition+suggestion.length]), {decorator}), suggestion}
    }
  }


  suggestionState(editorState, prevWord, nextWord, cursorPosition) {
    const {propertyIndex, partialProperty, partialNoun, suggestion} = getFactBankParams(prevWord)

    if (_.isEmpty(suggestion) && !_.isEmpty(this.state.suggestion) && nextWord === this.state.suggestion) {
      const noSuggestion = this.getReplacedEditorState(editorState, '', [cursorPosition, cursorPosition + this.state.suggestion.length])
      return {editorState: EditorState.set(noSuggestion, STATIC_DECORATOR)}
    } else if (prevWord.includes('.')) {
      return {isNoun: false, ...this.withSuggestion(editorState, partialProperty, suggestion, nextWord, prevWord.length-propertyIndex, PropertySpan)}
    } else {
      return {isNoun: true, ...this.withSuggestion(editorState, partialNoun, suggestion, nextWord, prevWord.length-1, NounSpan)}
    }

  }

  onChange(editorState) {
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
    if (text !== this.props.value) {
      if (isData(text)) {
        this.props.onChangeData(formatData(text))
      } else {
        this.props.onChange(text)
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
