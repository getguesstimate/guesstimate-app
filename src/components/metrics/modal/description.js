import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import ClickToEdit from 'gComponents/utility/click-to-edit/index.js'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index.js'
import ReactMarkdown from 'react-markdown'
import style from './description.css'
import Icon from 'react-fa'

export default class DescriptionViewer extends Component {
  render() {
    return(
      <MarkdownViewer source={this.props.value}/>
    )
  }
}

export default class GuesstimateDescription extends Component {
  render() {
    const {value} = this.props
    return (
      <div className='GuesstimateDescription'>
        <ClickToEdit
          viewing={<DescriptionViewer value={value}/>}
          emptyValue={<span className='emptyValue'><Icon name='align-left'/>Describe your reasoning...</span>}
          editingSaveText={'Save'}
          onSubmit={this.props.onChange}
          value={value}
        />
      </div>
    )
  }
}
