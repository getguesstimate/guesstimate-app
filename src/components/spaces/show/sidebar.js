import React, {Component} from 'react'

import ClickToEdit from 'gComponents/utility/click-to-edit/index.js'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index.js'
import {ButtonClose} from 'gComponents/utility/buttons/close'

export class SpaceSidebar extends Component {
  componentDidMount() { if (__DEV__) { window.RecordMountEvent(this) } }
  componentWillUpdate() { if (__DEV__) { window.RecordRenderStartEvent(this) } }
  componentDidUpdate() { if (__DEV__) { window.RecordRenderStopEvent(this) } }
  componentWillUnmount() { if (__DEV__) { window.RecordUnmountEvent(this) } }

  shouldComponentUpdate(nextProps) {
    return nextProps.canEdit !== this.props.canEdit || this.props.description !== nextProps.description
  }

  render() {
    const {description, canEdit, onClose, onSaveDescription} = this.props
    return (
      <div className='SpaceSidebar'>
        <div className='SpaceSidebar-inside'>
          <div className='SpaceSidebar-header'>
            <ButtonClose onClick={onClose}/>
          </div>
          <div className='SpaceSidebar-body'>
            <ClickToEdit
              viewing={<MarkdownViewer source={description}/>}
              emptyValue={<span className='emptyValue'>Describe this model...</span>}
              editingSaveText={'Save'}
              onSubmit={onSaveDescription}
              canEdit={canEdit}
              value={description}
            />
          </div>
        </div>
      </div>
    )
  }
}
