import React, {Component} from 'react'

import Icon from 'react-fa'
import {Card, CardListElement, CardListSection} from 'gComponents/utility/card/index.js'

import DropDown from 'gComponents/utility/drop-down/index.js'
import {PrivacyToggle} from './privacy-toggle/index'
import {SpaceName} from './spaceName'

import e from 'gEngine/engine'

import './header.css'

const EnableShareableLinkOption = ({onEnable}) => (
  <div>
    <p>Shareable link disabled.</p>
    <span className='ui button small shareable-link-button enable' onClick={onEnable}>Enable</span>
  </div>
)

const DisableOrRotateShareableLinkOption = ({shareableLinkUrl, onDisable, onRotate}) => (
  <div>
    <div className='ui segment shareable-link'><span>{shareableLinkUrl}</span></div>
    <p>Anyone with the shareable link will be able to view this model. They will not be able to edit the model.</p>

    <span className='ui button small shareable-link-button disable' onClick={onDisable}>Disable</span>
    <span className='ui button small shareable-link-button rotate' onClick={onRotate}>Reset Link</span>
  </div>
)

const ShareableLinkOption = ({children, shareableLinkUrl, onEnable, onDisable, onRotate}) => (
  <DropDown
      headerText={'Shareable Link'}
      openLink={children}
      position={'left'}
      width={'wide'}
  >
    <CardListSection>
      {!shareableLinkUrl && <EnableShareableLinkOption onEnable={onEnable} />}
      {!!shareableLinkUrl &&
        <DisableOrRotateShareableLinkOption shareableLinkUrl={shareableLinkUrl} onDisable={onDisable} onRotate={onRotate} />
      }
    </CardListSection>
  </DropDown>
)

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
      this.props.editableByMe !== nextProps.editableByMe ||
      this.props.shareableLinkUrl !== nextProps.shareableLinkUrl
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
      shareableLinkUrl,
      onPublicSelect,
      onPrivateSelect,
      onSaveName,
      onEnableShareableLink,
      onDisableShareableLink,
      onRotateShareableLink,
    } = this.props

    let privacy_header = (<span><Icon name='globe'/> Public</span>)
    if (isPrivate) {
      privacy_header = (<span><Icon name='lock'/> Private</span>)
    }

    return (
      <div className='container-fluid'>
        <div className='row header'>
          <div className='col-md-8 col-xs-6'>
            <div className='header-name'>
              <SpaceName
                  name={name}
                  editableByMe={editableByMe}
                  onSave={onSaveName}
              />
            </div>
          </div>

          <div className='col-md-4 col-xs-6'>
            {(ownerIsOrg || !editableByMe)  &&
              <a className='ui image label' href={ownerUrl}>
                <img src={ownerPicture}/>
                {ownerName}
              </a>
            }
            {isPrivate && editableByMe &&
              <ShareableLinkOption
                shareableLinkUrl={shareableLinkUrl}
                onEnable={onEnableShareableLink}
                onDisable={onDisableShareableLink}
                onRotate={onRotateShareableLink}
              >
                <div className='ui image label' >
                  <Icon name='link'/> Link
                </div>
              </ShareableLinkOption>
            }
            {ownerIsOrg && <a className='ui image label' href={`${ownerUrl}/fact-graph`}><Icon name='expand'/></a>}
            {editableByMe &&
              <PrivacyToggle
                editableByMe={editableByMe}
                openLink={<a className='space-header-action'>{privacy_header}</a>}
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
