import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Helmet from 'react-helmet'
import $ from 'jquery'

import {SpaceHeader} from './header'
import {SpaceToolbar} from './Toolbar/index'
import {SpaceSidebar} from './sidebar'
import {ClosedSpaceSidebar} from './closed_sidebar'
import Canvas from 'gComponents/spaces/canvas'
import {NewCalculatorForm} from 'gComponents/calculators/new'
import {EditCalculatorForm} from 'gComponents/calculators/edit'
import {CalculatorCompressedShow} from 'gComponents/calculators/show/CalculatorCompressedShow'
import {ButtonCloseText} from 'gComponents/utility/buttons/close'
import {ButtonEditText, ButtonDeleteText, ButtonExpandText} from 'gComponents/utility/buttons/button'
import {FactListContainer} from 'gComponents/facts/list/container.js'
import {Tutorial} from './Tutorial/index'

import {denormalizedSpaceSelector} from '../denormalized-space-selector'

import {allowEdits, forbidEdits, clearEditsAllowed} from 'gModules/canvas_state/actions'
import * as spaceActions from 'gModules/spaces/actions'
import * as simulationActions from 'gModules/simulations/actions'
import * as copiedActions from 'gModules/copied/actions'
import * as calculatorActions from 'gModules/calculators/actions'
import * as userActions from 'gModules/users/actions'
import {removeSelectedMetrics} from 'gModules/metrics/actions'
import {undo, redo} from 'gModules/checkpoints/actions'
import {navigateFn} from 'gModules/navigation/actions'

import {parseSlurp} from 'lib/slurpParser'

import e from 'gEngine/engine'

import * as elev from 'servers/elev/index'
import * as segment from 'servers/segment'

import './style.css'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

const spacePrepared = space => e.utils.isPresent(space) && e.utils.anyPresent(_.get(space, 'user.name'), _.get(space, 'organization.name'))

const PT = PropTypes

const CLOSED = 0
const NEW_CALCULATOR_FORM = 1
const EDIT_CALCULATOR_FORM = 2
const SHOW_CALCULATOR = 3
const FACT_SIDEBAR = 4

const ShowCalculatorHeader = ({id, editableByMe, onEdit, onDelete, onClose}) => (
  <div className='row'>
    <div className='col-xs-12'>
      <div className='button-close-text'>
        <ButtonExpandText onClick={navigateFn(`/calculators/${id}`)}/>
        {editableByMe && <ButtonEditText onClick={onEdit}/>}
        {editableByMe && <ButtonDeleteText onClick={onDelete}/>}
        <ButtonCloseText onClick={onClose}/>
      </div>
    </div>
  </div>
)

const CalculatorFormHeader = ({isNew, onClose}) => (
  <div className='row'>
    <div className='col-xs-8'><h2>{`${isNew ? 'New' : 'Edit'} Calculator`}</h2></div>
    <div className='col-xs-4 button-close-text'><ButtonCloseText onClick={onClose}/></div>
  </div>
)

const FactSidebarHeader = ({onClose, organizationId}) => (
  <div className='row'>
    <div className='col-xs-6'>
      <h2> Private Facts </h2>
    </div>
    <div className='col-xs-6'>
      <ButtonExpandText onClick={navigateFn(`/organizations/${organizationId}/facts`)}/>
      <div className='button-close-text'><ButtonCloseText onClick={onClose}/></div>
    </div>
  </div>
)


@connect(mapStateToProps)
@connect(denormalizedSpaceSelector)
export default class SpacesShow extends Component {
  displayName: 'RepoDetailPage'

  static propTypes = {
    dispatch: PT.func.isRequired,
    spaceId: PT.number,
    denormalizedSpace: PT.object,
    embed: PT.bool
  }

  state = {
    showLeftSidebar: true,
    showTutorial: !!_.get(this, 'props.me.profile.needs_tutorial'),
    attemptedFetch: false,
    rightSidebar: {
      type: !!this.props.showCalculatorId ? SHOW_CALCULATOR : CLOSED,
      showCalculatorResults: this.props.showCalculatorResults,
      showCalculatorId: this.props.showCalculatorId,
    },
  }

  componentWillMount() {
    window.recorder.recordMountEvent(this)

    this.considerFetch(this.props)
    this.props.dispatch(clearEditsAllowed())
    if (!(this.props.embed || this.state.rightSidebar.type !== CLOSED)) { elev.show() }
  }

  openTutorial() {
    this.setState({showTutorial: true})
    segment.trackOpenedTutorial()
  }
  closeTutorial() {
    if (!!_.get(this, 'props.me.profile.needs_tutorial')) { this.props.dispatch(userActions.finishedTutorial(this.props.me.profile)) }
    this.setState({showTutorial: false})
    segment.trackClosedTutorial()
  }

  componentWillUnmount() {
    window.recorder.recordUnmountEvent(this)

    if (!this.props.embed) { elev.hide() }
  }

  componentWillUpdate() {
    window.recorder.recordRenderStartEvent(this)
    if (this.props.embed) { $('#intercom-container').remove() }
  }

  componentDidUpdate(prevProps) {
    window.recorder.recordRenderStopEvent(this)

    this.considerFetch(prevProps)
  }

  considerFetch(newProps) {
    const space = newProps.denormalizedSpace

    const hasOwner = _.has(space, 'user.name') || _.has(space, 'organization.name')
    const hasGraph = _.has(space, 'graph')

    const hasData = this.state.attemptedFetch || (hasGraph && hasOwner)

    if (!hasData) {
      this.props.dispatch(spaceActions.fetchById(this._id()))
      this.setState({attemptedFetch: true})
    }
  }

  onSave() {
    this.props.dispatch(spaceActions.update(this._id()))
  }

  onRedo() {
    segment.trackUndo(false)
    this.props.dispatch(redo(this._id()))
  }

  onUndo() {
    segment.trackUndo(false)
    this.props.dispatch(undo(this._id()))
  }

  destroy() {
    this.props.dispatch(spaceActions.destroy(this.props.denormalizedSpace))
  }

  onImportSlurp(slurpObj) {
    segment.trackImportSlurp()
    const space = this.props.denormalizedSpace

    const spaceUpdates = parseSlurp(slurpObj, space)
    if (!space.name || !space.description) {
      let nonGraphUpdates = {}
      if (!space.name) {nonGraphUpdates.name = spaceUpdates.name}
      if (!space.description) {nonGraphUpdates.description = spaceUpdates.description}
      this.props.dispatch(spaceActions.update(this._id(), nonGraphUpdates))
    }
    if (!_.isEmpty(spaceUpdates.newMetrics)) {
      this.props.dispatch({type: 'ADD_METRICS', items: spaceUpdates.newMetrics, newGuesstimates: spaceUpdates.newGuesstimates})
      this.props.dispatch(spaceActions.updateGraph(this._id()))
      this.props.dispatch(simulationActions.runSimulations({spaceId: this._id(), simulateSubset: spaceUpdates.newMetrics.map(m => m.id)}))
    }
  }

  onPublicSelect() {
    this.props.dispatch(spaceActions.generalUpdate(this._id(), {is_private: false}))
  }

  onPrivateSelect() {
    this.props.dispatch(spaceActions.generalUpdate(this._id(), {is_private: true}))
  }

  onSaveName(name) {
    this.props.dispatch(spaceActions.update(this._id(), {name}))
  }

  onSaveDescription(description) {
    this.props.dispatch(spaceActions.update(this._id(), {description}))
  }

  hideLeftSidebar() {
    segment.trackCloseSidebar()
    this.setState({showLeftSidebar: false})
  }
  openLeftSidebar() {
    segment.trackOpenSidebar()
    this.setState({showLeftSidebar: true})
  }

  _handleCopyModel() {
    segment.trackCopyModel()
    this.props.dispatch(spaceActions.copy(this._id()))
  }

  onCopy(via_keyboard) {
    segment.trackCopyMetric(via_keyboard)
    this.props.dispatch(copiedActions.copy(this._id()))
  }

  onPaste(via_keyboard) {
    segment.trackPasteMetric(via_keyboard)
    this.props.dispatch(copiedActions.paste(this._id()))
  }

  onDeleteMetrics() {
    this.props.dispatch(removeSelectedMetrics(this.props.spaceId))
  }

  onCut(via_keyboard) {
    segment.trackCutMetric(via_keyboard)
    this.props.dispatch(copiedActions.cut(this._id()))
  }

  _id() {
    return parseInt(this.props.spaceId)
  }

  canShowFactSidebar() {
    const organization = _.get(this, 'props.denormalizedSpace.organization')
    if (!organization) { return false }

    const orgHasPrivateAccess = e.organization.hasPrivateAccess(organization)
    const isPrivate = _.get(this, 'props.denormalizedSpace.is_private')
    return !!isPrivate && orgHasPrivateAccess
  }

  closeRightSidebar() {
    elev.show()
    this.setState({rightSidebar: {type: CLOSED}})
  }
  openRightSidebar(rightSidebarState) {
    elev.hide()
    this.setState({rightSidebar: rightSidebarState})
  }
  showCalculator({id}) { this.openRightSidebar({type: SHOW_CALCULATOR, showCalculatorId: id}) }
  editCalculator(id) { this.openRightSidebar({type: EDIT_CALCULATOR_FORM, editCalculatorId: id}) }
  deleteCalculator(id) {
    this.props.dispatch(calculatorActions.destroy(id))
    this.closeRightSidebar()
  }
  makeNewCalculator() { this.openRightSidebar({type: NEW_CALCULATOR_FORM}) }
  toggleFactSidebar() {
    if (this.canShowFactSidebar()) {
      if (this.state.rightSidebar.type !== FACT_SIDEBAR){ this.openRightSidebar({type: FACT_SIDEBAR}) }
      else { this.closeRightSidebar() }
    }
  }

  rightSidebarBody() {
    const {props: {denormalizedSpace}, state: {rightSidebar: {type, showCalculatorResults, showCalculatorId, editCalculatorId}}} = this
    const {editableByMe, calculators, organization} = denormalizedSpace
    switch (type) {
      case CLOSED:
        return {}
      case SHOW_CALCULATOR:
        return {
          classes: [],
          header: (
            <ShowCalculatorHeader
              editableByMe={editableByMe}
              id={showCalculatorId}
              onEdit={this.editCalculator.bind(this, showCalculatorId)}
              onDelete={this.deleteCalculator.bind(this, showCalculatorId)}
              onClose={this.closeRightSidebar.bind(this)}
            />
          ),
          main: <CalculatorCompressedShow calculatorId={showCalculatorId} startFilled={showCalculatorResults}/>,
        }
      case EDIT_CALCULATOR_FORM:
        return {
          classes: [],
          header: <CalculatorFormHeader isNew={false} onClose={this.closeRightSidebar.bind(this)}/>,
          main: (
            <EditCalculatorForm
              space={denormalizedSpace}
              calculator={calculators.find(c => c.id === editCalculatorId)}
              onCalculatorSave={this.showCalculator.bind(this)}
            />
          ),
        }
      case NEW_CALCULATOR_FORM:
        return {
          classes: [],
          header: <CalculatorFormHeader isNew={true} onClose={this.closeRightSidebar.bind(this)}/>,
          main: (
            <NewCalculatorForm
              space={denormalizedSpace}
              onCalculatorSave={this.showCalculator.bind(this)}
            />
          ),
        }
      case FACT_SIDEBAR:
        return {
          classes: ['grey'],
          header: (
            <FactSidebarHeader
              onClose={this.closeRightSidebar.bind(this)}
              organizationId={organization.id}
            />
          ),
          main: (
            <div className='SpaceRightSidebar--padded-area'>
              <FactListContainer organizationId={organization.id} isEditable={false}/>
            </div>
          ),
        }
    }
  }

  rightSidebar() {
    if (this.state.rightSidebar.type === CLOSED) { return false }
    const {classes, header, main} = this.rightSidebarBody()

    return (
      <div className={['SpaceRightSidebar', ...classes].join(' ')} >
        <div className='SpaceRightSidebar--padded-area'>{header}</div>
        <hr className='SpaceRightSidebar--divider'/>
        {main}
      </div>
    )
  }

  render() {
    const space = this.props.denormalizedSpace
    const {organizationHasFacts, me} = this.props
    if (!spacePrepared(space)) { return <div className='spaceShow'></div> }

    const sidebarIsViseable = space.editableByMe || !_.isEmpty(space.description)

    const isLoggedIn = e.me.isLoggedIn(this.props.me)
    if (this.props.embed) {
      return (
        <div className='spaceShow screenshot'>
          <Canvas denormalizedSpace={space} organizationHasFacts={organizationHasFacts} overflow={'hidden'} screenshot={true}/>
        </div>
      )
    }

    const hasOrg = _.has(space, 'organization.name')
    const owner = hasOrg ? space.organization : space.user
    const ownerUrl = hasOrg ? e.organization.url(space.organization) : e.user.url(space.user)

    const canBePrivate = hasOrg ? e.organization.canMakeMorePrivateModels(space.organization) : e.me.canMakeMorePrivateModels(this.props.me)

    const authorCallout = `Made by ${owner.name}`
    const tagDescription = _.isEmpty(space.description) ? authorCallout : `${authorCallout}: ${space.description}`

    return (
      <div className='spaceShow'>
        {!space.name &&
          <Helmet
            meta={[
              {name: 'Description', content: tagDescription},
              {property: 'og:description', content: tagDescription},
              {property: 'og:site_name', content: 'Guesstimate'},
              {property: 'og:image', content: space.big_screenshot},
            ]}
          />
        }
        {space.name &&
          <Helmet
            title={space.name}
            meta={[
              {name: 'Description', content: tagDescription},
              {property: 'og:title', content: space.name},
              {property: 'og:description', content: tagDescription},
              {property: 'og:site_name', content: 'Guesstimate'},
              {property: 'og:image', content: space.big_screenshot},
            ]}
          />
        }
        {this.state.showTutorial && <Tutorial onClose={this.closeTutorial.bind(this)} />}

        <div className='hero-unit'>
          <SpaceHeader
            name={space.name}
            isPrivate={space.is_private}
            editableByMe={space.editableByMe}
            canBePrivate={canBePrivate}
            ownerName={owner.name}
            ownerPicture={owner.picture}
            ownerUrl={ownerUrl}
            ownerIsOrg={hasOrg}
            onSaveName={this.onSaveName.bind(this)}
            onPublicSelect={this.onPublicSelect.bind(this)}
            onPrivateSelect={this.onPrivateSelect.bind(this)}
          />

          <SpaceToolbar
            editsAllowed={space.canvasState.editsAllowedManuallySet ? space.canvasState.editsAllowed : space.editableByMe}
            onAllowEdits={() => {
              segment.trackSwitchToEditMode()
              this.props.dispatch(allowEdits())
            }}
            onForbidEdits={() => {
              segment.trackSwitchToViewMode()
              this.props.dispatch(forbidEdits())
            }}
            isLoggedIn={isLoggedIn}
            onDestroy={this.destroy.bind(this)}
            onCopyModel={this._handleCopyModel.bind(this)}
            onCopyMetrics={this.onCopy.bind(this, false)}
            onPasteMetrics={this.onPaste.bind(this, false)}
            onDeleteMetrics={this.onDeleteMetrics.bind(this)}
            onCutMetrics={this.onCut.bind(this, false)}
            isPrivate={space.is_private}
            editableByMe={space.editableByMe}
            actionState={space.canvasState.actionState}
            onUndo={this.onUndo.bind(this)}
            onRedo={this.onRedo.bind(this)}
            canUndo={space.checkpointMetadata.head !== space.checkpointMetadata.length - 1}
            canRedo={space.checkpointMetadata.head !== 0}
            onImportSlurp={this.onImportSlurp.bind(this)}
            calculators={space.calculators}
            makeNewCalculator={this.makeNewCalculator.bind(this)}
            showCalculator={this.showCalculator.bind(this)}
            toggleFactSidebar={this.toggleFactSidebar.bind(this)}
            canShowFactSidebar={this.canShowFactSidebar()}
            onOpenTutorial={this.openTutorial.bind(this)}
          />
        </div>

        <div className='content'>
          {sidebarIsViseable && this.state.showLeftSidebar &&
            <SpaceSidebar
              description={space.description}
              canEdit={space.editableByMe}
              onClose={this.hideLeftSidebar.bind(this)}
              onSaveDescription={this.onSaveDescription.bind(this)}
            />
          }
          {sidebarIsViseable && !this.state.showLeftSidebar &&
            <ClosedSpaceSidebar onOpen={this.openLeftSidebar.bind(this)}/>
          }
          <Canvas
            organizationHasFacts={organizationHasFacts}
            denormalizedSpace={space}
            onCopy={this.onCopy.bind(this, true)}
            onPaste={this.onPaste.bind(this, true)}
            onCut={this.onCut.bind(this, true)}
          />
          {this.rightSidebar()}
        </div>
      </div>
    )
  }
}
