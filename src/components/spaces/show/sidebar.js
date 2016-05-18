import React, {Component} from 'react'

import ClickToEdit from 'gComponents/utility/click-to-edit/index.js'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index.js'
import {ButtonClose} from 'gComponents/utility/buttons/close'

export default class DescriptionViewer extends Component {
  render() {
    return(
      <MarkdownViewer source={this.props.value}/>
    )
  }
}

export default class SpaceSidebar extends Component {
  render() {
    const {description, canEdit} = this.props
    return (
      <div className='SpaceSidebar'>
        <div className='SpaceSidebar-inside'>
          <div className='SpaceSidebar-header'>
            <ButtonClose onClick={this.props.onClose}/>
          </div>
          <div className='SpaceSidebar-body'>
            <ClickToEdit
              viewing={<DescriptionViewer value={description}/>}
              emptyValue={<span className='emptyValue'>Describe this model...</span>}
              editingSaveText={'Save'}
              onSubmit={this.props.onSaveDescription}
              canEdit={canEdit}
              value={description}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default SpaceSidebar
