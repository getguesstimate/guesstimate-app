import React, {Component} from 'react'

import Icon from 'react-fa'

import CanvasViewForm from './canvasViewForm'
import DropDown, {DropDownListElement} from 'gComponents/utility/drop-down/index'
import {PrivacyToggle} from './privacy-toggle/index'
import {SpaceName} from './spaceName'
import ReactTooltip from 'react-tooltip'

import e from 'gEngine/engine'

import './header.css'

const ProgressMessage = ({actionState}) => (
  <div className='saveMessage'>
    {actionState == 'SAVING' && 'Saving...'}
    {actionState == 'COPYING' && 'Copying...'}
    {actionState == 'CREATING' && 'Creating a new model...'}
    {actionState == 'ERROR' &&
      <div className='ui red horizontal label'>
        ERROR SAVING
      </div>
    }
    {actionState == 'ERROR_COPYING' &&
      <div className='ui red horizontal label'>
        ERROR COPYING
      </div>
    }
    {actionState == 'ERROR_CREATING' &&
      <div className='ui red horizontal label'>
        ERROR CREATING NEW MODEL
      </div>
    }
    {actionState == 'SAVED' && 'All changes saved'}
    {actionState == 'COPIED' && 'Successfully copied'}
    {actionState == 'CREATED' && 'New model created'}
  </div>
)

const SpaceHeader = ({
  canBePrivate,
  name,
  isPrivate,
  editableByMe,
  actionState,
  isLoggedIn,
  onSave,
  onCopy,
  onDestroy,
  onPublicSelect,
  onPrivateSelect,
  onSaveName,
  onUndo,
  canUndo,
  onRedo,
  canRedo
}) => {
  let privacy_header = (<span><Icon name='globe'/> Public</span>)
  if (isPrivate) {
    privacy_header = (<span><Icon name='lock'/> Private</span>)
  }
  const ReactTooltipParams = {class: 'small-tooltip', delayShow: 0, delayHide: 0, place: 'bottom', effect: 'solid'}

  return (
    <div className='header'>
      <ReactTooltip {...ReactTooltipParams} id='undo-button'>Undo (ctrl-z)</ReactTooltip>
      <ReactTooltip {...ReactTooltipParams} id='redo-button'>Redo (ctrl-shift-z)</ReactTooltip>

      <div className='header-name'>
        <SpaceName
            name={name}
            editableByMe={editableByMe}
            onSave={onSaveName}
        />
      </div>

      <div className='header-actions'>
        {editableByMe &&
          <div className='ui buttons tiny'>
            <button onClick={onUndo} className={`ui icon button ${canUndo ? '' : 'disabled'}`} data-tip data-for='undo-button'>
              <Icon name='undo'/>
            </button>
            <button onClick={onRedo} className={`ui icon button ${canRedo ? '' : 'disabled'}`} data-tip data-for='redo-button'>
              <Icon name='rotate-right'/>
            </button>
          </div>
        }

        <CanvasViewForm/>

        {editableByMe &&
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

        {editableByMe &&
          <PrivacyToggle
            headerText={'Privacy Options'}
            openLink={<a className='space-header-action'>{privacy_header}</a>}
            position='right'
            isPrivateSelectionInvalid={!canBePrivate}
            isPrivate={isPrivate}
            onPublicSelect={onPublicSelect}
            onPrivateSelect={onPrivateSelect}
          />
        }
        { isLoggedIn &&
          <div onMouseDown={onCopy} className='copy-button'>
            <a className='space-header-action'><Icon name='copy'/> Copy</a>
          </div>
        }
        <ProgressMessage actionState={actionState}/>
      </div>
    </div>
  )
}

export default SpaceHeader
