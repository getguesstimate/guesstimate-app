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
    {actionState == 'CONFLICT' &&
      <div className='ui red horizontal label'>
        {"Model has changed since your last save. Refresh and try again later."}
      </div>
    }
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
      <ReactTooltip {...ReactTooltipParams} id='cut-button'>Cut (ctrl-x)</ReactTooltip>
      <ReactTooltip {...ReactTooltipParams} id='copy-button'>Copy (ctrl-c)</ReactTooltip>
      <ReactTooltip {...ReactTooltipParams} id='paste-button'>Paste (ctrl-p)</ReactTooltip>
      <ReactTooltip {...ReactTooltipParams} id='undo-button'>Undo (ctrl-z)</ReactTooltip>
      <ReactTooltip {...ReactTooltipParams} id='redo-button'>Redo (ctrl-shift-z)</ReactTooltip>


      <div className='row'>
        <div className='header-name'>
          <SpaceName
              name={name}
              editableByMe={editableByMe}
              onSave={onSaveName}
          />
        </div>

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

        <ProgressMessage actionState={actionState}/>
      </div>
      <div className='row'>
        <div className='header-actions'>

          { isLoggedIn &&
            <DropDown
                headerText={'Model Actions'}
                openLink={<div className='ui buttons tiny'><a className='ui icon button'>File</a></div>}
                position='right'
            >
              <ul>
                <DropDownListElement icon={'copy'} header='Copy Model' onMouseDown={onCopy}/>
                {editableByMe &&
                  <DropDownListElement icon={'warning'} header='Delete Model' onMouseDown={onDestroy}/>
                }
              </ul>
            </DropDown>
          }

            <CanvasViewForm/>
            <div className='ui buttons tiny'>
              <button onClick={onUndo} className={`ui icon button`} data-tip data-for='cut-button'>
                <Icon name='cut'/>
              </button>
              <button onClick={onUndo} className={`ui icon button`} data-tip data-for='copy-button'>
                <Icon name='copy'/>
              </button>
              <button onClick={onUndo} className={`ui icon button`} data-tip data-for='paste-button'>
                <Icon name='paste'/>
              </button>
            </div>
            <div className='ui buttons tiny'>
              <button onClick={onUndo} className={`ui icon button ${canUndo ? '' : 'disabled'}`} data-tip data-for='undo-button'>
                <Icon name='undo'/>
              </button>
              <button onClick={onRedo} className={`ui icon button ${canRedo ? '' : 'disabled'}`} data-tip data-for='redo-button'>
                <Icon name='repeat'/>
              </button>
            </div>

        </div>
      </div>
    </div>
  )
}

export default SpaceHeader
