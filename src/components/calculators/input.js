import React, {Component, PropTypes} from 'react'

import {EditorState, Editor, ContentState} from 'draft-js'

export class Input extends Component{
  state = {editorState: EditorState.createWithContent(ContentState.createFromText(''))}

  onChange(editorState) {
    this.props.onChange(editorState.getCurrentContent().getPlainText(''))
    return this.setState({editorState})
  }

  render () {
    return (
      <div className='input row'>
        <div className='name col-md-7'>{this.props.name}</div>
        <div className='editor col-md-5'>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this)}
          />
        </div>
      </div>
    )
  }
}
