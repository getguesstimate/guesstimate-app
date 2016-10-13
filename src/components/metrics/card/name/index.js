import React, {Component, PropTypes} from 'react'

import {EditorState, Editor, ContentState, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js'

import {typeSafeEq} from 'gEngine/utils'

import './style.css'

export default class MetricName extends Component {
  static propTypes = {
    name: PropTypes.string,
    inSelectedCell: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  }

  state = {
    editorState: this.plainTextEditorState(this.props.name)
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.name !== nextProps.name) && (nextProps.name !== this.value())) {
      this.changePlainText(nextProps.name)
    }
  }

  componentWillUnmount() { this.handleSubmit() }
  handleSubmit() { if (this.hasChanged()){ this.props.onChange(this.value()) } }
  hasChanged() { return !typeSafeEq(this.value(), this.props.name || '') }
  hasContent() { return !_.isEmpty(this.value()) }
  value() { return this.state.editorState.getCurrentContent().getPlainText('') }
  handleKeyDown(e) { e.stopPropagation(); this.props.heightHasChanged() }
  focus() { this.refs.editor.focus() }
  plainTextEditorState(value) { return EditorState.createWithContent(ContentState.createFromText(value || '')) }
  changePlainText(value) { this.setState({editorState: this.plainTextEditorState(value)}) }

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
    const {props: {anotherFunctionSelected}, state: {editorState}} = this

    return (
      <span
        className={`MetricName ${!anotherFunctionSelected ? 'isClickable' : ''}`}
        onKeyDown={this.handleKeyDown.bind(this)}
      >
        <div onClick={!anotherFunctionSelected && this.focus.bind(this)}>
          <Editor
            editorState={editorState}
            onBlur={this.handleSubmit.bind(this)}
            onChange={editorState => this.setState({editorState})}
            handleReturn={this.onReturn.bind(this)}
            onTab={this.onTab.bind(this)}
            ref='editor'
            placeholder={'name'}
          />
        </div>
      </span>
    )
  }
}
