import React, {Component, PropTypes} from 'react'

import TextArea from 'react-textarea-autosize'
import {EditorState, Editor, ContentState, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js'

import './style.css'

class SimpleEditor extends React.Component {
  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''))
  }

  _onChange(editorState) {
   this.props.onChange(editorState.getCurrentContent().getPlainText(''))
   return this.setState({editorState})
  }

  focus() {
    this.refs.editor.focus()
  }

  render() {
    const {editorState} = this.state;
    return (
      <div onClick={this.focus.bind(this)}>
      <Editor
        editorState={editorState}
        onBlur={this.props.onBlur}
        onChange={this._onChange.bind(this)}
        tabIndex={2}
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
    if (this.props.name === this.state.value) {this.setState({value: nextProps.name})}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ((nextProps.name !== this.props.name) ||
            (nextProps.inSelectedCell !== this.props.inSelectedCell) ||
            (nextState.value !== this.state.value))
  }

  handleSubmit() {
    if (this._hasChanged()){
      this.props.onChange({name: this.state.value})
    }
  }

  _hasChanged() {
    return (this.state.value != this.props.name)
  }

  hasContent() {
    return !_.isEmpty(this.state.value)
  }

  componentWillUnmount() {
    this.handleSubmit()
  }

  onChange(value) {
    this.setState({value})
  }

  handleKeyDown(e) {
    e.stopPropagation()
    const ENTER = (e) => ((e.keyCode === 13) && !e.shiftKey)
    if (ENTER(e)){
      e.stopPropagation()
      this.props.jumpSection()
    }
  }

  render() {
    return (
      <span
        className='MetricName'
        onKeyDown={this.handleKeyDown.bind(this)}
      >
        <SimpleEditor
          onBlur={this.handleSubmit.bind(this)}
          onChange={this.onChange.bind(this)}
          value={this.state.value}
          placeholder={'name'}
        />
      </span>
    )
  }
}
