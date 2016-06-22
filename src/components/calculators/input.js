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
      <div className='input'>
        <div className='row'>
          <div className='col-md-7'><div className='name'>{this.props.name}</div></div>
          <div className='col-md-5'>
            <div className='editor'>
              <Editor
                editorState={this.state.editorState}
                onChange={this.onChange.bind(this)}
                handleReturn={() => true}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
