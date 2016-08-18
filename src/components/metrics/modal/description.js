import React, {Component} from 'react'

import Icon from 'react-fa'

import ClickToEdit from 'gComponents/utility/click-to-edit/index'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index'

import './description.css'

const GuesstimateDescription = ({value, onChange}) => (
  <div className='GuesstimateDescription'>
    <ClickToEdit
      viewing={<MarkdownViewer source={value}/>}
      emptyValue={<span className='emptyValue'><Icon name='align-left'/>Describe your reasoning...</span>}
      editingSaveText={'Save'}
      onSubmit={onChange}
      value={value}
      canEdit={true}
    />
  </div>
)

export default GuesstimateDescription
