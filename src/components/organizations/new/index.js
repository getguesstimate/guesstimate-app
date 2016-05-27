import React, {Component} from 'react'

import {EditorState, Editor, ContentState, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js'

class OrganizationNameEditor extends Component {
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
          onChange={this._onChange.bind(this)}
          tabIndex={2}
          ref='editor'
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

export class CreateOrganizationForm extends Component {
  state = {
    value: ""
  }

  render() {
    return (
      <div className="organization-form">
        <h1>Create a new organization</h1>
        <input
          value={this.state.value}
          onChange={(e) => {this.setState({value: e.target.value})}}
        />
        <br/>
        <span className="button">Submit</span>
      </div>
    )
  }
}
