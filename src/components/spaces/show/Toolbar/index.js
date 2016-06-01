import React, {Component} from 'react'

import Icon from 'react-fa'
import ReactTooltip from 'react-tooltip'

import CanvasViewForm from '../canvasViewForm'
import DropDown, {DropDownListElement} from 'gComponents/utility/drop-down/index'
import {ViewOptionToggle} from '../view-options/index'
import {PrivacyToggle} from '../privacy-toggle/index'
import {SpaceName} from '../spaceName'
import e from 'gEngine/engine'
import './style.css'

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
  editableByMe,
  actionState,
  isLoggedIn,
  onCopyModel,
  onCopyMetrics,
  onPasteMetrics,
  onCutMetrics,
  onDestroy,
  onUndo,
  canUndo,
  onRedo,
  canRedo,
  editsAllowed,
  onAllowEdits,
  onForbidEdits,
}) => {
  const ReactTooltipParams = {class: 'small-tooltip', delayShow: 0, delayHide: 0, place: 'bottom', effect: 'solid'}

  let view_mode_header = (<span><Icon name='eye'/> Viewing </span>)
  if (editsAllowed) {
    view_mode_header = (<span><Icon name='pencil'/> Editing </span>)
  }
  return (
    <div className='SpaceShowToolbar container-fluid'>
      <div className='row'>
        <div className='col-sm-10'>
          <ReactTooltip {...ReactTooltipParams} id='cut-button'>Cut Nodes (ctrl-x)</ReactTooltip>
          <ReactTooltip {...ReactTooltipParams} id='copy-button'>Copy Nodes (ctrl-c)</ReactTooltip>
          <ReactTooltip {...ReactTooltipParams} id='paste-button'>Paste Nodes (ctrl-p)</ReactTooltip>
          <ReactTooltip {...ReactTooltipParams} id='undo-button'>Undo (ctrl-z)</ReactTooltip>
          <ReactTooltip {...ReactTooltipParams} id='redo-button'>Redo (ctrl-shift-z)</ReactTooltip>

          { isLoggedIn &&
            <DropDown
                headerText={'Model Actions'}
                openLink={<a className='header-action'>File</a>}
                position='right'
            >
              <ul>
                <DropDownListElement icon={'copy'} header='Copy Model' onMouseDown={onCopyModel}/>
                {editableByMe &&
                  <DropDownListElement icon={'warning'} header='Delete Model' onMouseDown={onDestroy}/>
                }
              </ul>
            </DropDown>
          }

          <CanvasViewForm/>

          <div className='header-action-border'/>
          <a onClick={onCutMetrics} className={`header-action`} data-tip data-for='cut-button'>
            <Icon name='cut'/>
          </a>
          <a onClick={onCopyMetrics} className={`header-action`} data-tip data-for='copy-button'>
            <Icon name='copy'/>
          </a>
          <a onClick={onPasteMetrics} className={`header-action`} data-tip data-for='paste-button'>
            <Icon name='paste'/>
          </a>
          <div className='header-action-border'/>
          <a onClick={onUndo} className={`header-action ${canUndo ? '' : 'disabled'}`} data-tip data-for='undo-button'>
            <Icon name='undo'/>
          </a>
          <a onClick={onRedo} className={`header-action ${canRedo ? '' : 'disabled'}`} data-tip data-for='redo-button'>
            <Icon name='repeat'/>
          </a>

          <ProgressMessage actionState={actionState}/>

        </div>
        <div className='col-sm-2'>
          <div className='float-right'>
            <ViewOptionToggle
              headerText={'Saving Options'}
              openLink={<a className='header-action button'>{view_mode_header}</a>}
              position='left'
              isEditingInvalid={!editableByMe}
              isEditing={editsAllowed}
              onAllowEdits={onAllowEdits}
              onForbidEdits={onForbidEdits}
            />
        </div>
        </div>
      </div>
    </div>
  )
}

export default SpaceHeader
