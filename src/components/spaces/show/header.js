import React, {Component} from 'react'

import Icon from 'react-fa'

import {PrivacyToggle} from './privacy-toggle/index'
import {SpaceName} from './spaceName'

import e from 'gEngine/engine'

import './header.css'

export class SpaceHeader extends Component {
  componentDidMount() { window.recorder.recordMountEvent(this) }
  componentWillUpdate() { window.recorder.recordRenderStartEvent(this) }
  componentDidUpdate() { window.recorder.recordRenderStopEvent(this) }
  componentWillUnmount() { window.recorder.recordUnmountEvent(this) }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.editableByMe) { return false }

    return (
      this.props.name !== nextProps.name ||
      this.props.isPrivate !== nextProps.isPrivate ||
      this.props.editableByMe !== nextProps.editableByMe
    )
  }

  render() {
    const {
      canBePrivate,
      name,
      ownerName,
      ownerPicture,
      ownerUrl,
      ownerIsOrg,
      isPrivate,
      editableByMe,
      onPublicSelect,
      onPrivateSelect,
      onSaveName
    } = this.props

    let privacy_header = (<span><Icon name='globe'/> Public</span>)
    if (isPrivate) {
      privacy_header = (<span><Icon name='lock'/> Private</span>)
    }

    return (
      <div className='container-fluid'>
        <div className='row header'>
          <div className='col-sm-8'>
            <div className='header-name'>
              <SpaceName
                  name={name}
                  editableByMe={editableByMe}
                  onSave={onSaveName}
              />
            </div>
          </div>

          <div className='col-sm-4'>
            {(ownerIsOrg || !editableByMe)  &&
              <a className='ui image label' href={ownerUrl}>
                <img src={ownerPicture}/>
                {ownerName}
              </a>
            }
            {editableByMe &&
              <PrivacyToggle
                headerText={'Privacy Options'}
                openLink={<a className='space-header-action'>{privacy_header}</a>}
                position='left'
                isPrivateSelectionInvalid={!canBePrivate}
                isPrivate={isPrivate}
                onPublicSelect={onPublicSelect}
                onPrivateSelect={onPrivateSelect}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}
