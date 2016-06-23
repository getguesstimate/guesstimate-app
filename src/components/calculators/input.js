import React, {Component} from 'react'

import Icon from 'react-fa'

import {EditorState, Editor, ContentState} from 'draft-js'

export class Input extends Component{
  state = {editorState: EditorState.createWithContent(ContentState.createFromText(''))}

  onChange(editorState) {
    this.props.onChange(editorState.getCurrentContent().getPlainText(''))
    return this.setState({editorState})
  }

  hasValidContent() {
    const content = this.state.editorState.getCurrentContent().getPlainText('')
    return !_.isEmpty(content) && _.isEmpty(this.props.errors)
  }

  render () {
    const {name, errors} = this.props
    return (
      <div className='input'>
        <div className='row'>
          <div className='col-md-7'><div className='name'>{name}</div></div>
          <div className='col-md-5'>
            <div className='editor'>
              <Editor
                editorState={this.state.editorState}
                onChange={this.onChange.bind(this)}
                handleReturn={() => true}
              />
              {!_.isEmpty(errors) && <div className='error-alert'><Icon name='warning' /></div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
