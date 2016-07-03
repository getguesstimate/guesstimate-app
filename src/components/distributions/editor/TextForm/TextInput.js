import React, {Component, PropTypes} from 'react'

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {nounSearch, propertySearch} from 'gModules/factBank/actions'

// Note: these aren't very good regexes, don't use them!
const NOUN_REGEX = /\@[\w]+/g
const PROPERTY_REGEX = /\.[\w]+/g

function nounStrategy(contentBlock, callback) {
  findWithRegex(NOUN_REGEX, contentBlock, callback)
}

function propertyStrategy(contentBlock, callback) {
  findWithRegex(PROPERTY_REGEX, contentBlock, callback)
}

function partialTextStrategy(start, end) {
  return (contentBlock, callback) => { callback(start, end); }
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const NounSpan = (props) => <span {...props} style={{color: 'red'}}>{props.children}</span>
const PropertySpan = (props) => <span {...props} style={{color: 'blue'}}>{props.children}</span>

const compositeDecorator = new CompositeDecorator([
  {
    strategy: nounStrategy,
    component: NounSpan,
  },
  {
    strategy: propertyStrategy,
    component: PropertySpan,
  },
])

class TextInputEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''), compositeDecorator),
    possibleProperties: [],
    possibleNouns: [],
    partialNoun: '',
    partialProperty: '',
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
    this._onChange(this.getInsertedEditorState(this.state.editorState, text, maintainCursorPosition))
  }

  componentWillUnmount() {
    const selection = this.state.editorState.getSelection()
    if (selection && selection.getHasFocus()) {
      this.props.onBlur()
    }
  }

  focus() {
    this.refs.editor.focus()
  }

  _onChange(editorState) {
    const text = editorState.getCurrentContent().getPlainText('')

    const cursorPosition = editorState.getSelection().getFocusOffset()
    const prevWord = text.slice(0, cursorPosition).split(/[^\w@\.]/).pop()

    let newState = {
      possibleNouns: [],
      possibleProperties: [],
      partialNoun: '',
      partialProperty: '',
      fillText: '',
      noun: '',
      property: '',
      editorState,
    }

    if (!prevWord.startsWith('@')) {
      this.setState(newState)
      this.props.onChange(text)
      return
    }

    const nextWord = text.slice(cursorPosition).split(/[^\w]/)[0]

    if (prevWord.includes('.')) {
      const noun = prevWord.slice(1, prevWord.indexOf('.'))
      const partialProperty = prevWord.slice(prevWord.indexOf('.') + 1)
      const possibleProperties = propertySearch(noun, partialProperty)
      const fillText = _.isEmpty(possibleProperties) ? '' : possibleProperties[0].replace(partialProperty, '')

      const shouldFillOrReplaceText = false // !_.isEmpty(partialProperty)
      Object.assign(newState, { possibleProperties, partialProperty, noun, editorState })

      if (shouldFillOrReplaceText) {
        newState.fillText = fillText
        if (_.isEmpty(nextWord)) {
          newState.editorState = this.getInsertedEditorState(editorState, fillText, true)
        } else {
          // replace text
        }
      }
    } else {
      const partialNoun = prevWord.slice(1)
      const possibleNouns = nounSearch(partialNoun)

      const fillText = _.isEmpty(possibleNouns) ? '' : possibleNouns[0].replace(partialNoun, '')

      const shouldFillOrReplaceText = false //(nextWord === this.state.fillText || _.isEmpty(nextWord))
      Object.assign(newState, { possibleNouns, partialNoun, editorState })

      if (shouldFillOrReplaceText) {
        newState.fillText = fillText
        if (_.isEmpty(nextWord)) {
          newState.editorState = this.getInsertedEditorState(editorState, fillText, true)
        } else {
          // replace text
        }
      }
    }
    this.setState(newState)
    this.props.onChange(text)
  }

  handleReturn(e) {
    return this.props.onReturn(e.shiftKey)
  }

  handleEscape() {
    this.props.handleEscape()
  }

  handleTab(e){
    const {possibleNouns, possibleProperties, partialNoun, partialProperty} = this.state


    if (!(_.isEmpty(possibleNouns) && _.isEmpty(possibleProperties))) {
      if (!_.isEmpty(possibleNouns)) {
        const noun = possibleNouns[0].replace(partialNoun, '')
        this.insertAtCaret(`${noun}.`)
        this.setState({possibleNouns: [], partialNoun: '', noun})
      } else {
        const property = possibleProperties[0].replace(partialProperty, '')
        this.insertAtCaret(`${property}`)
        this.setState({possibleProperties: [], partialProperty: '', property})
      }
    } else {
      this.props.onTab(e.shiftKey)
    }
    e.preventDefault()
  }

  onKeyDown(e) {
    this.props.onKeyDown(e)
  }

  render() {
    const {editorState} = this.state;
    return (
      <span
        className={this.props.className}
        onClick={this.focus.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
        onFocus={this.props.onFocus}
      >
        <Editor
          onFocus={this.props.onFocus}
          onEscape={this.handleEscape.bind(this)}
          editorState={editorState}
          handleReturn={this.handleReturn.bind(this)}
          onTab={this.handleTab.bind(this)}
          onBlur={this.props.onBlur}
          onChange={this._onChange.bind(this)}
          ref='editor'
          placeholder={this.props.placeholder}
        />
      </span>
    )
  }
}

export default class TextInput extends Component{
  displayName: 'Guesstimate-TextInput'

  static propTypes = {
    value: PropTypes.string,
  }

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
        onKeyDown={e => {e.stopPropagation()}}
        handleEscape={this.props.onEscape}
        onReturn={this.props.onReturn}
        onTab={this.props.onTab}
        value={this.props.value}
        placeholder={'value'}
        ref='editor'
      />
    )
  }
}
