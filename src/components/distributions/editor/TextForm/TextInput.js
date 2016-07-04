import React, {Component, PropTypes} from 'react'

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {isData, formatData} from 'lib/guesstimator/formatter/formatters/Data'

import {nounSearch, propertySearch} from 'gModules/factBank/actions'

// Note: these aren't very good regexes, don't use them!
const NOUN_REGEX = /\@[\w]+/g
const PROPERTY_REGEX = /\.[\w]+/g

function positionDecorator(start, end, component) {
  return {
    strategy: (contentBlock, callback) => { callback(start, end) },
    component,
  }
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

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

export default class TextInput extends Component{
  displayName: 'Guesstimate-TextInput'

  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''), STATIC_DECORATOR),
    possibleProperties: [],
    possibleNouns: [],
    partialNoun: '',
    partialProperty: '',
  }

  static propTypes = {
    value: PropTypes.string,
  }

  focus() { this.refs.editor.focus() }

  getReplacedEditorState(editorState, text, [anchorOffset, focusOffset], maintainCursorPosition = false) {
    const selection = editorState.getSelection()
    const content = editorState.getCurrentContent()
    const newContentState = Modifier.replaceText(content, selection.merge({anchorOffset, focusOffset: focusOffset + 1}), text)

    const baseEditorState = EditorState.push(editorState, newContentState, 'paste')

    if (!maintainCursorPosition) { return baseEditorState }

    const cursorPosition = selection.getFocusOffset()
    const newSelectionState = selection.merge({focusOffset: cursorPosition})
    return EditorState.forceSelection(baseEditorState, newSelectionState)
  }

  getInsertedEditorState(editorState, text, maintainCursorPosition = false) {
    const selection = editorState.getSelection()
    const content = editorState.getCurrentContent()
    const newContentState = Modifier.insertText(content, selection, text)

    const baseEditorState = EditorState.push(editorState, newContentState, 'paste')

    if (!maintainCursorPosition) { return baseEditorState }

    const cursorPosition = selection.getFocusOffset()
    const newSelectionState = selection.merge({focusOffset: cursorPosition})
    return EditorState.forceSelection(baseEditorState, newSelectionState)
  }

  insertAtCaret(text, maintainCursorPosition = false) {
    this.onChange(EditorState.set(this.getInsertedEditorState(this.state.editorState, text, maintainCursorPosition), STATIC_DECORATOR))
  }

  replaceAtCaret(text, start, end, maintainCursorPosition = false) {
    this.onChange(EditorState.set(this.getReplacedEditorState(this.state.editorState, text, [start, end], maintainCursorPosition), STATIC_DECORATOR))
  }

  componentWillUnmount() {
    const selection = this.state.editorState.getSelection()
    if (selection && selection.getHasFocus()) {
      this.props.onBlur()
    }
  }

  onChange(editorState) {
    let newState = {
      possibleNouns: [],
      possibleProperties: [],
      partialNoun: '',
      partialProperty: '',
      suggestion: '',
      noun: '',
      property: '',
      editorState,
    }

    const text = editorState.getCurrentContent().getPlainText('')

    const selection = editorState.getSelection()
    const cursorPosition = selection.getFocusOffset()
    const prevWord = text.slice(0, cursorPosition).split(/[^\w@\.]/).pop()

    if (prevWord.startsWith('@') && selection.isCollapsed()) {
      const nextWord = text.slice(cursorPosition).split(/[^\w]/)[0]
      if (prevWord.includes('.')) {
        const noun = prevWord.slice(1, prevWord.indexOf('.'))
        const propertyIndex = prevWord.indexOf('.') + 1
        const partialProperty = prevWord.slice(propertyIndex)
        const possibleProperties = propertySearch(noun, partialProperty)
        const suggestion = _.isEmpty(possibleProperties) ? '' : possibleProperties[0].replace(partialProperty, '')

        Object.assign(newState, { possibleProperties, partialProperty, noun })

        if (!(_.isEmpty(partialProperty) || _.isEmpty(suggestion)) && ((nextWord || '') === (this.state.suggestion || ''))) {
          newState.suggestion = suggestion
          const [start, end] = [cursorPosition, cursorPosition+suggestion.length]
          const decorator = new CompositeDecorator([
            positionDecorator(cursorPosition - prevWord.length + propertyIndex - 1, cursorPosition, PropertySpan),
            positionDecorator(start, end, SuggestionSpan),
            ...STATIC_DECORATOR_LIST
          ])
          if (_.isEmpty(this.state.suggestion)) {
            newState.editorState = EditorState.set(this.getInsertedEditorState(editorState, suggestion, true), {decorator})
          } else {
            newState.editorState = EditorState.set(this.getReplacedEditorState(editorState, suggestion, [start, end], true), {decorator})
          }
        }
      } else {
        const partialNoun = prevWord.slice(1)
        const possibleNouns = nounSearch(partialNoun)

        const suggestion = _.isEmpty(possibleNouns) ? '' : possibleNouns[0].replace(partialNoun, '')

        Object.assign(newState, { possibleNouns, partialNoun, editorState })

        if (!(_.isEmpty(partialNoun) || _.isEmpty(suggestion)) && ((nextWord || '') === (this.state.suggestion || ''))) {
          newState.suggestion = suggestion
          const [start, end] = [cursorPosition, cursorPosition+suggestion.length]
          const decorator = new CompositeDecorator([
            positionDecorator(cursorPosition - prevWord.length, cursorPosition, NounSpan),
            positionDecorator(start, end, SuggestionSpan),
            ...STATIC_DECORATOR_LIST
          ])
          if (_.isEmpty(this.state.suggestion)) {
            newState.editorState = EditorState.set(this.getInsertedEditorState(editorState, suggestion, true), {decorator})
          } else {
            newState.editorState = EditorState.set(this.getReplacedEditorState(editorState, suggestion, [start, end], true), {decorator})
          }
        }
      }

      if (_.isEmpty(newState.suggestion) && !_.isEmpty(this.state.suggestion) && nextWord === this.state.suggestion) {
        const noSuggestion = this.getReplacedEditorState(newState.editorState, '', [cursorPosition, cursorPosition + this.state.suggestion.length], true)
        newState.editorState = EditorState.set(noSuggestion, STATIC_DECORATOR)
      }
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
    const {possibleNouns, possibleProperties, partialNoun, partialProperty} = this.state

    if (!(_.isEmpty(possibleNouns) && _.isEmpty(possibleProperties))) {
      if (!_.isEmpty(possibleNouns)) {
        const noun = possibleNouns[0].replace(partialNoun, '')
        if (_.isEmpty(this.state.suggestion)) {
          this.insertAtCaret(`${noun}.`)
        } else {
          const cursorPosition = this.state.editorState.getSelection().getFocusOffset()
          this.replaceAtCaret(`${noun}.`, cursorPosition, cursorPosition+this.state.suggestion.length - 1)
        }
      } else {
        const property = possibleProperties[0].replace(partialProperty, '')
        if (_.isEmpty(this.state.suggestion)) {
          this.insertAtCaret(property)
        } else {
          const cursorPosition = this.state.editorState.getSelection().getFocusOffset()
          this.replaceAtCaret(property, cursorPosition, cursorPosition+this.state.suggestion.length - 1)
        }
      }
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
