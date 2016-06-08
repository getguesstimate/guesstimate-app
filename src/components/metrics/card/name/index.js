import React, {Component, PropTypes} from 'react'

import {EditorState, Editor, ContentState, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js'

import './style.css'

class NameEditor extends Component {
  state = {
    editorState: this._plainTextEditorState(this.props.value)
  }

  _plainTextEditorState(value) {
    return EditorState.createWithContent(ContentState.createFromText(value || ''))
  }

  _onChange(editorState) {
   return this.setState({editorState})
  }

  focus() {
    this.refs.editor.focus()
  }

  changePlainText(value) {
    this.setState({editorState: this._plainTextEditorState(value)})
  }

  getPlainText() {
    return this.state.editorState.getCurrentContent().getPlainText('')
  }

  render() {
    const {editorState} = this.state;
    return (
      <div onClick={this.props.isClickable && this.focus.bind(this)}>
        <Editor
          editorState={editorState}
          onBlur={this.props.onBlur}
          onChange={this._onChange.bind(this)}
          handleReturn={this.props.handleReturn}
          onTab={this.props.handleTab}
          onEscape={this.props.onEscape}
          ref='editor'
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

export default class MetricName extends Component {
  displayName: 'MetricName'

  static propTypes = {
    name: PropTypes.string,
    inSelectedCell: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  }

  state = {
    value: this.props.name
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.name !== nextProps.name) && (nextProps.name !== this.value())) {
      this.refs.NameEditor && this.refs.NameEditor.changePlainText(nextProps.name)
    }
  }

  componentWillUnmount() {
    this.handleSubmit()
  }

  handleSubmit() {
    if (this._hasChanged()){
      this.props.onChange({name: this.value()})
    }
  }

  _hasChanged() {
    return ((this.value() || '') != (this.props.name || ''))
  }

  hasContent() {
    return !_.isEmpty(this.value())
  }

  value() {
    return this.refs.NameEditor.getPlainText()
  }

  focus() {
    this.refs.NameEditor.focus()
  }

  handleKeyDown(e) {
    e.stopPropagation()
    this.props.heightHasChanged()
  }

  onReturn(e) {
    if (e.shiftKey) {
      this.props.onReturn(false)
    } else {
      this.props.jumpSection()
    }
    return true
  }

  onTab(e) {
    if (e.shiftKey) {
      this.props.onTab(false)
    } else {
      this.props.jumpSection()
    }
    e.preventDefault()
    return true
  }

  render() {
    const isClickable = !this.props.anotherFunctionSelected
    return (
      <span
        className={`MetricName ${isClickable ? 'isClickable' : ''}`}
        onKeyDown={this.handleKeyDown.bind(this)}
      >
        <NameEditor
          onBlur={this.handleSubmit.bind(this)}
          value={this.state.value}
          handleReturn={this.onReturn.bind(this)}
          handleTab={this.onTab.bind(this)}
          onEscape={this.props.onEscape}
          placeholder={'name'}
          isClickable={isClickable}
          onTab={this.props.onTab}
          ref='NameEditor'
        />
      </span>
    )
  }
}
