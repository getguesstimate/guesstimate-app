import React, {Component} from 'react'

import Icon from 'react-fa'

import CanvasViewForm from './canvasViewForm'
import DropDown, {DropDownListElement} from 'gComponents/utility/drop-down/index'
import {PrivacyToggle} from './privacy-toggle/index'
import {SpaceName} from './spaceName'
import ReactTooltip from 'react-tooltip'

import e from 'gEngine/engine'

import './header.css'

const SpaceHeader = ({
  canBePrivate,
  name,
  space,
  isPrivate,
  editableByMe,
  editsAllowed,
  onAllowEdits,
  onForbidEdits,
  actionState,
  isLoggedIn,
  onPublicSelect,
  onPrivateSelect,
  onSaveName
}) => {
  let privacy_header = (<span><Icon name='globe'/> Public</span>)
  if (isPrivate) {
    privacy_header = (<span><Icon name='lock'/> Private</span>)
  }


  const ReactTooltipParams = {class: 'small-tooltip', delayShow: 0, delayHide: 0, place: 'bottom', effect: 'solid'}

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

            {!!space.organization &&
              <a className='ui image label' href={`/organizations/${space.organization.id}`}>
                <img src={space.organization.picture}/>
                {space.organization.name}
              </a>
            }
            {!space.organization && space.user && !space.editableByMe &&
              <a className='ui image label' href={`/users/${space.user.id}`}>
                <img src={space.user.picture}/>
                {space.user.name}
              </a>
            }

            {space.editableByMe &&
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

export default SpaceHeader
