import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Helmet from 'react-helmet'

import SpacesShowHeader from './header'
import SpacesShowToolbar from './Toolbar/index'
import ClosedSpaceSidebar from './closed_sidebar.js'
import SpaceSidebar from './sidebar'
import Canvas from 'gComponents/spaces/canvas'

import {denormalizedSpaceSelector} from '../denormalized-space-selector.js'

import * as spaceActions from 'gModules/spaces/actions.js'
import * as copiedActions from 'gModules/copied/actions'
import {undo, redo} from 'gModules/checkpoints/actions'

import e from 'gEngine/engine'

import * as elev from 'server/elev/index.js'

import './style.css'

function mapStateToProps(state) {
  return {
    me: state.me
  }
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
    this.considerFetch(this.props)
    if (!this.props.embed) { elev.show() }
  }

  componentWillUnmount() {
    if (!this.props.embed) { elev.hide() }
  }

  componentDidUpdate(newProps) {
    this.considerFetch(newProps)
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

  _handleCopyMetrics() {
    this.props.dispatch(copiedActions.copy(this._id()))
  }

  _handlePasteMetrics() {
    this.props.dispatch(copiedActions.paste(this._id()))
  }

  _id() {
    return parseInt(this.props.spaceId)
  }

  render() {
    const space = this.props.denormalizedSpace;
    if (!space) { return <div className='spaceShow'></div> }

    const sidebarIsViseable = space.editableByMe || !_.isEmpty(space.description)
    const canBePrivate = !!space.organization_id || e.me.canMakeMorePrivateModels(this.props.me)
    const isLoggedIn = e.me.isLoggedIn(this.props.me)
    if (this.props.embed) {
      return (
        <div className='spaceShow screenshot'>
          <Canvas spaceId={space.id} overflow={'hidden'} screenshot={true}/>
        </div>
      )
    }

    let tagDescription = space.description
    if (_.has(space, 'user.name') || _.has(space, 'organization.name')) {
      const author = _.has(space, 'organization.name') ? space.organization.name : space.user.name
      const authorCallout = `Made by ${author}`
      if (_.isEmpty(space.description)) {
        tagDescription = authorCallout
      } else {
        tagDescription = `${authorCallout}: ${tagDescription}`
      }
    }

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
          <div className='container-fluid'>
            <SpacesShowHeader
              isLoggedIn={isLoggedIn}
              onSaveName={this.onSaveName.bind(this)}
              name={space.name}
              isPrivate={space.is_private}
              editableByMe={space.editableByMe}
              actionState={space.canvasState.actionState}
              canBePrivate={canBePrivate}
              onPublicSelect={this.onPublicSelect.bind(this)}
              onPrivateSelecundot={this.onPrivateSelect.bind(this)}
              space={space}
            />
          </div>

          <div className='SpaceShowSidebar container-fluid'>
            <div className='row'>
              <div className='col-md-10'>
                <SpacesShowToolbar
                  isLoggedIn={isLoggedIn}
                  onDestroy={this.destroy.bind(this)}
                  onCopyModel={this._handleCopyModel.bind(this)}
                  onCopyMetrics={this._handleCopyMetrics.bind(this)}
                  onPasteMetrics={this._handlePasteMetrics.bind(this)}
                  isPrivate={space.is_private}
                  editableByMe={space.editableByMe}
                  actionState={space.canvasState.actionState}
                  onUndo={this.onUndo.bind(this)}
                  onRedo={this.onRedo.bind(this)}
                  canUndo={space.checkpointMetadata.head !== space.checkpointMetadata.length - 1}
                  canRedo={space.checkpointMetadata.head !== 0}
                />
              </div>
            </div>
          </div>
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
          <Canvas spaceId={space.id}/>
        </div>
      </div>
    )
  }
}
