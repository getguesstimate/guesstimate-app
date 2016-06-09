import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Helmet from 'react-helmet'

import {SpaceHeader} from './header'
import {SpaceToolbar} from './Toolbar/index'
import {SpaceSidebar} from './sidebar'
import {ClosedSpaceSidebar} from './closed_sidebar'
import Canvas from 'gComponents/spaces/canvas'

import {denormalizedSpaceSelector} from '../denormalized-space-selector'

import {allowEdits, forbidEdits} from 'gModules/canvas_state/actions'
import * as spaceActions from 'gModules/spaces/actions'
import * as simulationActions from 'gModules/simulations/actions'
import * as copiedActions from 'gModules/copied/actions'
import {undo, redo} from 'gModules/checkpoints/actions'

import {parseSlurp} from 'lib/slurpParser'

import e from 'gEngine/engine'

import * as elev from 'server/elev/index'

import './style.css'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

function spacePrepared(space) {
  return (
    !!space &&
    (_.has(space, 'user.name') || _.has(space, 'organization.name'))
  )
}

const PT = PropTypes

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
    showSidebar: true,
    attemptedFetch: false,
  }

  componentWillMount() {
    window.recorder.recordMountEvent(this)

    this.considerFetch(this.props)
    if (!this.props.embed) { elev.show() }

    if (_.has(this.props, 'denormalizedSpace.editableByMe')) {
      this.setDefaultEditPermission(_.get(this.props, 'denormalizedSpace.editableByMe'))
    }
  }

  setDefaultEditPermission(editableByMe) {
    if (!!editableByMe && !_.get(this.props, 'denormalizedSpace.canvasState.editsAllowed')) {
      this.props.dispatch(allowEdits())
    } else if (!editableByMe && _.get(this.props, 'denormalizedSpace.canvasState.editsAllowed')) {
      this.props.dispatch(forbidEdits())
    }
  }

  componentWillUnmount() {
    window.recorder.recordUnmountEvent(this)

    if (!this.props.embed) { elev.hide() }
  }

  componentWillUpdate() {
    window.recorder.recordRenderStartEvent(this)
  }

  componentDidUpdate(prevProps) {
    window.recorder.recordRenderStopEvent(this)

    this.considerFetch(prevProps)
  }

  considerFetch(newProps) {
    const space = newProps.denormalizedSpace
    const needsData = !_.has(space, 'graph')

    if (needsData) {
      this.fetchData()
    }
  }

  fetchData() {
    if (!this.state.attemptedFetch) {
      this.props.dispatch(spaceActions.fetchById(this._id()))
      this.setState({attemptedFetch: true})
    }
  }

  onSave() {
    this.props.dispatch(spaceActions.update(this._id()))
  }

  onRedo() {
    this.props.dispatch(redo(this._id()))
  }

  onUndo() {
    this.props.dispatch(undo(this._id()))
  }

  destroy() {
    this.props.dispatch(spaceActions.destroy(this.props.denormalizedSpace))
  }

  onImportSlurp(slurpObj) {
    const space = this.props.denormalizedSpace

    const spaceUpdates = parseSlurp(slurpObj, space)
    let noGraphUpdates = {}
    if (!space.name) {noGraphUpdates.name = spaceUpdates.name}
    if (!space.description) {noGraphUpdates.description = spaceUpdates.description}
    this.props.dispatch(spaceActions.update(this._id(), noGraphUpdates))
    this.props.dispatch({type: 'ADD_METRICS', items: spaceUpdates.newMetrics, newGuesstimates: spaceUpdates.newGuesstimates})
    this.props.dispatch(spaceActions.updateGraph(this._id()))
    this.props.dispatch(simulationActions.runSimulations(this._id(), spaceUpdates.newMetrics))
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

  hideSidebar() {
    this.setState({showSidebar: false})
  }
  openSidebar() {
    this.setState({showSidebar: true})
  }

  _handleCopyModel() {
    this.props.dispatch(spaceActions.copy())
  }

  onCopy() {
    this.props.dispatch(copiedActions.copy(this._id()))
  }

  onPaste() {
    this.props.dispatch(copiedActions.paste(this._id()))
  }

  onCut() {
    this.props.dispatch(copiedActions.cut(this._id()))
  }

  _id() {
    return parseInt(this.props.spaceId)
  }

  render() {
    const space = this.props.denormalizedSpace
    if (!spacePrepared(space)) { return <div className='spaceShow'></div> }

    const sidebarIsViseable = space.editableByMe || !_.isEmpty(space.description)
    const canBePrivate = !!space.organization_id || e.me.canMakeMorePrivateModels(this.props.me)
    const isLoggedIn = e.me.isLoggedIn(this.props.me)
    if (this.props.embed) {
      return (
        <div className='spaceShow screenshot'>
          <Canvas denormalizedSpace={space} overflow={'hidden'} screenshot={true}/>
        </div>
      )
    }

    const hasOrg = _.has(space, 'organization.name')
    const owner = hasOrg ? space.organization : space.user
    const ownerUrl = hasOrg ? e.organization.url(space.organization) : e.user.url(space.user)

    const authorCallout = `Made by ${owner.name}`
    const tagDescription = _.isEmpty(space.description) ? authorCallout : `${authorCallout}: ${space.description}`

    return (
      <div className='spaceShow'>
        {!space.name &&
          <Helmet
            meta={[
              {name: "Description", content: tagDescription},
              {property: "og:description", content: tagDescription},
              {property: "og:site_name", content: "Guesstimate"},
              {property: "og:image", content: space.big_screenshot},
            ]}
          />
        }
        {space.name &&
          <Helmet
            title={space.name}
            meta={[
              {name: "Description", content: tagDescription},
              {property: "og:title", content: space.name},
              {property: "og:description", content: tagDescription},
              {property: "og:site_name", content: "Guesstimate"},
              {property: "og:image", content: space.big_screenshot},
            ]}
          />
        }

        <div className='hero-unit'>
          <SpaceHeader
            name={space.name}
            isPrivate={space.is_private}
            editableByMe={space.editableByMe}
            canBePrivate={canBePrivate}
            ownerName={owner.name}
            ownerPicture={owner.picture}
            ownerUrl={ownerUrl}
            onSaveName={this.onSaveName.bind(this)}
            onPublicSelect={this.onPublicSelect.bind(this)}
            onPrivateSelect={this.onPrivateSelect.bind(this)}
          />

          <SpaceToolbar
            editsAllowed={space.canvasState.editsAllowed}
            onAllowEdits={() => {this.props.dispatch(allowEdits())}}
            onForbidEdits={() => {this.props.dispatch(forbidEdits())}}
            isLoggedIn={isLoggedIn}
            onDestroy={this.destroy.bind(this)}
            onCopyModel={this._handleCopyModel.bind(this)}
            onCopyMetrics={this.onCopy.bind(this)}
            onPasteMetrics={this.onPaste.bind(this)}
            onCutMetrics={this.onCut.bind(this)}
            isPrivate={space.is_private}
            editableByMe={space.editableByMe}
            actionState={space.canvasState.actionState}
            onUndo={this.onUndo.bind(this)}
            onRedo={this.onRedo.bind(this)}
            canUndo={space.checkpointMetadata.head !== space.checkpointMetadata.length - 1}
            canRedo={space.checkpointMetadata.head !== 0}
            onImportSlurp={this.onImportSlurp.bind(this)}
          />
        </div>

        <div className='content'>
          {sidebarIsViseable && this.state.showSidebar &&
            <SpaceSidebar
              description={space.description}
              canEdit={space.editableByMe}
              onClose={this.hideSidebar.bind(this)}
              onSaveDescription={this.onSaveDescription.bind(this)}
            />
          }
          {sidebarIsViseable && !this.state.showSidebar &&
            <ClosedSpaceSidebar onOpen={this.openSidebar.bind(this)}/>
          }
          <Canvas
            denormalizedSpace={space}
            onCopy={this.onCopy.bind(this)}
            onPaste={this.onPaste.bind(this)}
            onCut={this.onCut.bind(this)}
          />
        </div>
      </div>
    )
  }
}
