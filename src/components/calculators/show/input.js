import React, {Component} from 'react'

import Icon from 'react-fa'

import {Guesstimator} from 'lib/guesstimator/index'

import {EditorState, Editor, ContentState} from 'draft-js'

export class Input extends Component{
  static defaultProps = {
    errors: []
  }

  state = {editorState: EditorState.createWithContent(ContentState.createFromText(''))}

  componentDidMount() {
    if (this.props.isFirst) {
      setTimeout(() => {this.refs.editor.focus()}, 1)
    }
  }

  blur() {
    this.refs.editor.blur()
  }

  onBlur() {
    this.props.onBlur(this.state.editorState.getCurrentContent().getPlainText(''))
  }

  onChange(editorState) {
    this.props.onChange(editorState.getCurrentContent().getPlainText(''))
    return this.setState({editorState})
  }

  getContent() { return this.state.editorState.getCurrentContent().getPlainText('') }

  hasValidContent() {
    const input = this.getContent()
    return !_.isEmpty(input) && _.isEmpty(Guesstimator.parse({input})[0])
  }

  render () {
    const {name, description, errors, onEnter, id} = this.props
    return (
      <div className='input'>
        <div className='row'>
          <div className='col-xs-12 col-sm-7'>
            <div className='name'>{name}</div>
            {description &&
              <div className='description'>{description}</div>
            }
          </div>
          <div className='col-xs-12 col-sm-5'>
            <div className='editor'>
              <Editor
                ref='editor'
                editorState={this.state.editorState}
                onChange={this.onChange.bind(this)}
                onBlur={this.onBlur.bind(this)}
                handleReturn={() => {onEnter(id); return true}}
              />
              {!_.isEmpty(errors) && <div className='status error'><Icon name='close' /></div>}
              {this.hasValidContent() && <div className='status success'><Icon name='check' /></div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
