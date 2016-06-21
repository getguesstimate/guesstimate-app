import React, {Component, PropTypes} from 'react'

import {EditorState, Editor, ContentState, Modifier} from 'draft-js'

export default class TextInputEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.value || ''))
  }

  componentWillUnmount() {
    const selection = this.state.editorState.getSelection()
    if (selection && selection.getHasFocus()) {
      this.props.onBlur()
    }
  }

  _text(editorState) {
    return editorState.getCurrentContent().getPlainText('')
  }

  _onChange(editorState) {
    this.props.onChange(this._text(editorState))
    return this.setState({editorState})
  }

  render() {
    const {editorState} = this.state;
    const {hasErrors, onBlur} = this.props
    return (
      <span className={`TextInput${hasErrors ? ' hasErrors' : ''}`}>
        <Editor
          editorState={editorState}
          onBlur={onBlur}
          onChange={this._onChange.bind(this)}
        />
      </span>
    )
  }
}
