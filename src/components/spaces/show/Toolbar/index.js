import React, {Component} from 'react'

import Icon from 'react-fa'
import ReactTooltip from 'react-tooltip'
import Modal from 'react-modal'

import CanvasViewForm from '../canvasViewForm'
import DropDown from 'gComponents/utility/drop-down/index'
import {CardListElement} from 'gComponents/utility/card/index.js'
import {ViewOptionToggle} from '../view-options/index'
import {PrivacyToggle} from '../privacy-toggle/index'
import {ImportFromSlurpForm} from './import_from_slurp_form'

import {navigateFn} from 'gModules/navigation/actions'

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

export class SpaceToolbar extends Component {
  componentDidMount() { window.recorder.recordMountEvent(this) }
  componentWillUpdate() { window.recorder.recordRenderStartEvent(this) }
  componentDidUpdate() { window.recorder.recordRenderStopEvent(this) }
  componentWillUnmount() { window.recorder.recordUnmountEvent(this) }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.editableByMe !== nextProps.editableByMe ||
      this.props.actionState !== nextProps.actionState ||
      this.props.editsAllowed !== nextProps.editsAllowed ||
      this.props.canUndo !== nextProps.canUndo ||
      this.props.canRedo !== nextProps.canRedo ||
      this.props.isLoggedIn !== nextProps.isLoggedIn ||
      !_.isEqual(this.props.calculators, nextProps.calculator) ||
      this.state.importModalOpen !== nextState.importModalOpen
    )
  }

  state = {
    importModalOpen: false
  }

  onImportSlurp(slurp) {
    this.setState({importModalOpen: false})
    this.props.onImportSlurp(slurp)
  }

  render() {
    const {
      editableByMe,
      actionState,
      isLoggedIn,
      onCopyModel,
      onCopyMetrics,
      onPasteMetrics,
      onDeleteMetrics,
      onCutMetrics,
      onDestroy,
      onUndo,
      canUndo,
      onRedo,
      canRedo,
      editsAllowed,
      onAllowEdits,
      onForbidEdits,
      calculators,
      makeNewCalculator,
      toggleFactSidebar,
    } = this.props
    const ReactTooltipParams = {class: 'header-action-tooltip', delayShow: 0, delayHide: 0, place: 'bottom', effect: 'solid'}

    let view_mode_header = (<span><Icon name='eye'/> Viewing </span>)
    if (editableByMe && editsAllowed) {
      view_mode_header = (<span><Icon name='pencil'/> Editing </span>)
    }
    const customStyles = {
      overlay: {
        backgroundColor: 'rgba(55, 68, 76, 0.4)'
      },
      content : {
        top: '30%',
        left: '30%',
        width: '40%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        backgroundColor: '#F0F0F0',
        border: 'none',
        padding: '1em'
      }
    }
    return (
      <div className='SpaceShowToolbar container-fluid'>
        <Modal
          isOpen={this.state.importModalOpen}
          onRequestClose={() => {this.setState({importModalOpen: false})}}
          style={customStyles}
        >
          <ImportFromSlurpForm onSubmit={this.onImportSlurp.bind(this)} />
        </Modal>
        <div className='row'>
          <div className='col-sm-10'>
            <ReactTooltip {...ReactTooltipParams} id='cut-button'>Cut Nodes (ctrl-x)</ReactTooltip>
            <ReactTooltip {...ReactTooltipParams} id='copy-button'>Copy Nodes (ctrl-c)</ReactTooltip>
            <ReactTooltip {...ReactTooltipParams} id='paste-button'>Paste Nodes (ctrl-v)</ReactTooltip>
            <ReactTooltip {...ReactTooltipParams} id='delete-button'>Delete Nodes (del/bksp)</ReactTooltip>
            <ReactTooltip {...ReactTooltipParams} id='undo-button'>Undo (ctrl-z)</ReactTooltip>
            <ReactTooltip {...ReactTooltipParams} id='redo-button'>Redo (ctrl-shift-z)</ReactTooltip>

            {isLoggedIn &&
              <DropDown
                headerText={'Model Actions'}
                openLink={<a className='header-action'>File</a>}
                position='right'
              >
                <CardListElement icon={'copy'} header='Copy Model' onMouseDown={onCopyModel}/>
                {editableByMe &&
                  <CardListElement
                    icon={'download'}
                    header='Import Slurp'
                    onMouseDown={() => {this.setState({importModalOpen: true})}}
                    closeOnClick={true}
                  />
                }
                {editableByMe && <CardListElement icon={'warning'} header='Delete Model' onMouseDown={onDestroy}/> }
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
            <a onClick={onDeleteMetrics} className={`header-action`} data-tip data-for='delete-button'>
              <Icon name='trash'/>
            </a>

            <div className='header-action-border'/>
            <a onClick={onUndo} className={`header-action ${canUndo ? '' : 'disabled'}`} data-tip data-for='undo-button'>
              <Icon name='undo'/>
            </a>
            <a onClick={onRedo} className={`header-action ${canRedo ? '' : 'disabled'}`} data-tip data-for='redo-button'>
              <Icon name='repeat'/>
            </a>

            {(editableByMe || !_.isEmpty(calculators)) &&
              <div>
                <div className='header-action-border'/>
                <DropDown
                  headerText={'Calculators'}
                  openLink={<a className='header-action'><Icon name='calculator'/></a>}
                  position='right'
                >
                  {[
                    ..._.map(calculators, c => (
                      <CardListElement
                        key={c.id}
                        header={c.title}
                        onMouseDown={() => {this.props.showCalculator(c)}}
                        closeOnClick={true}
                        icon={'calculator'}
                      />
                    )),
                    editableByMe && (
                      <CardListElement
                        key={'new'}
                        header={'New Calculator'}
                        onMouseDown={makeNewCalculator}
                        closeOnClick={true}
                        icon={'plus'}
                      />
                    )
                  ]}
                </DropDown>
              </div>
            }

            {this.props.canShowFactSidebar &&
              <a onClick={toggleFactSidebar} className={`header-action`}> <Icon name='bank'/> </a>
            }

            {editableByMe && editsAllowed && <ProgressMessage actionState={actionState}/>}

          </div>
          <div className='col-sm-2'>
            <div className='float-right'>
              <ViewOptionToggle
                headerText={'Saving Options'}
                openLink={<a className='header-action button'>{view_mode_header}</a>}
                position='left'
                isEditingInvalid={!editableByMe}
                isEditing={editableByMe && editsAllowed}
                onAllowEdits={onAllowEdits}
                onForbidEdits={onForbidEdits}
              />
          </div>
          </div>
        </div>
      </div>
    )
  }
}
