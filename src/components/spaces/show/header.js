import React, {Component} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import CanvasViewForm from './canvasViewForm.js'
import Icon from 'react-fa'
import e from 'gEngine/engine'
import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
import {SpaceName} from './spaceName.js'
import {PrivacyToggleDropdown} from '../privacy-toggle/index.js'
import './header.css'

const SaveMessage = ({saveState}) => (
  <div className='saveMessage'>
    {saveState == 'SAVING' && 'Saving...'}
    {saveState == 'ERROR' &&
      <div className='ui red horizontal label'>
        ERROR SAVING
      </div>
    }
    {saveState == 'SAVED' && 'All changes saved'}
  </div>
)

const SpaceHeader = ({canMakeMorePrivateModels, space, onSave, onDestroy, onPublicSelect, onPrivateSelect, onSaveName, canUsePrivateModels}) => {
  let privacy_header = (<span> <Icon name='globe'/> Public </span>)
  if (space.is_private) {
    privacy_header = (<span> <Icon name='lock'/> Private </span>)
  }

  return (
    <div className='header'>

      <div className='header-name'>
        <SpaceName
            name={space.name}
            ownedByMe={space.ownedByMe}
            onSave={onSaveName}
        />
      </div>

      <div className='header-actions'>
        <CanvasViewForm/>

        {space.ownedByMe &&
          <DropDown
              headerText={'Model Actions'}
              openLink={<a className='space-header-action'>Model Actions</a>}
              position='right'
          >
            <ul>
              <DropDownListElement icon={'warning'} header='Delete Model' onMouseDown={onDestroy}/>
            </ul>
          </DropDown>
        }

        {space.ownedByMe && canUsePrivateModels &&
          <PrivacyToggleDropdown
            headerText={'Privacy Options'}
            openLink={<a className='space-header-action'>{privacy_header}</a>}
            position='right'
            isPrivateSelectionValid={canMakeMorePrivateModels}
            isPrivate={space.is_private}
            onPublicSelect={onPublicSelect}
            onPrivateSelect={onPrivateSelect}
          />
        }
        <SaveMessage saveState={space.canvasState.saveState} ownedByMe={space.ownedByMe}/>
      </div>
    </div>
  )
}

export default SpaceHeader
