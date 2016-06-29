import React, {Component, PropTypes} from 'react'

import $ from 'jquery'
import {EditorState, Editor, ContentState, Modifier, CompositeDecorator} from 'draft-js'

import {nounSearch, propertySearch} from 'gModules/factBank/actions'

// Note: these aren't very good regexes, don't use them!
const NOUN_REGEX = /\@[\w]+/g
const PROPERTY_REGEX = /\.[\w]+/g

function nounStrategy(contentBlock, callback) {
  findWithRegex(NOUN_REGEX, contentBlock, callback);
}

function propertyStrategy(contentBlock, callback) {
  findWithRegex(PROPERTY_REGEX, contentBlock, callback);
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
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''), compositeDecorator)
  }

  insertAtCaret(text) {
    const {editorState} = this.state
    const selection = editorState.getSelection()
    const content = editorState.getCurrentContent()
    const newContentState = Modifier.insertText(content, selection, text)
    const newEditorState = EditorState.push(editorState, newContentState, 'paste')
    this._onChange(newEditorState)
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

  _text(editorState) {
    return editorState.getCurrentContent().getPlainText('')
  }

  _onChange(editorState) {
    const text = this._text(editorState)

    const nounIndex = text.lastIndexOf('@')
    const propertyIndex = text.lastIndexOf('.')
    const spaceIndex = text.lastIndexOf(' ')

    if (text.startsWith('=') && nounIndex != -1 && nounIndex > spaceIndex) {
      if (propertyIndex > nounIndex) {
        const noun = text.slice(nounIndex+1, propertyIndex)
        const partialProperty = text.slice(propertyIndex+1)
        const possibleProperties = propertySearch(noun, partialProperty)
      } else {
        const partialNoun = text.slice(nounIndex+1)
        const possibleNouns = nounSearch(partialNoun)
      }
    }

    this.props.onChange(this._text(editorState))
    return this.setState({editorState})
  }

  handleReturn(e) {
    return this.props.onReturn(e.shiftKey)
  }

  handleEscape() {
    this.props.handleEscape()
  }

  handleTab(e){
    this.props.onTab(e.shiftKey)
    e.preventDefault()
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
    );
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
