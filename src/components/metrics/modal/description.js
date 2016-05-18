import React, {Component} from 'react'

import Icon from 'react-fa'

import ClickToEdit from 'gComponents/utility/click-to-edit/index'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index'

import './description.css'

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
          canEdit={true}
        />
      </div>
    )
  }
}
