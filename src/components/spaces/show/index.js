import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux';

import SpacesShowHeader from './header'
import ClosedSpaceSidebar from './closed_sidebar.js'
import SpaceSidebar from './sidebar'
import Canvas from 'gComponents/spaces/canvas'

import {denormalizedSpaceSelector} from '../denormalized-space-selector.js';

import * as spaceActions from 'gModules/spaces/actions.js'

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
      this.props.dispatch(spaceActions.fetchById(parseInt(this.props.spaceId)))
      this.setState({attemptedFetch: true})
    }
  }

  onSave() {
    this.props.dispatch(spaceActions.update(parseInt(this.props.spaceId)))
  }
  destroy() {
    this.props.dispatch(spaceActions.destroy(this.props.denormalizedSpace))
  }

  onPublicSelect() {
    this.props.dispatch(spaceActions.generalUpdate(parseInt(this.props.spaceId), {is_private: false}))
  }

  onPrivateSelect() {
    this.props.dispatch(spaceActions.generalUpdate(parseInt(this.props.spaceId), {is_private: true}))
  }

  onSaveName(name) {
    this.props.dispatch(spaceActions.update(parseInt(this.props.spaceId), {name}))
  }
  onSaveDescription(description) {
    this.props.dispatch(spaceActions.update(parseInt(this.props.spaceId), {description}))
  }

  hideSidebar() {
    this.setState({showSidebar: false})
  }
  openSidebar() {
    this.setState({showSidebar: true})
  }

  _handleCopy() {
    this.props.dispatch(spaceActions.copy(parseInt(this.props.spaceId)))
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

    return (
      <div className='spaceShow'>
        <div className='hero-unit container-fluid'>
          <div className='row'>
            <div className='col-md-10'>
              <SpacesShowHeader
                isLoggedIn={isLoggedIn}
                onDestroy={this.destroy.bind(this)}
                onSaveName={this.onSaveName.bind(this)}
                onSave={this.onSave.bind(this)}
                onCopy={this._handleCopy.bind(this)}
                space={space}
                name={space.name}
                isPrivate={space.is_private}
                editableByMe={space.editableByMe}
                actionState={space.canvasState.actionState}
                canBePrivate={canBePrivate}
                onPublicSelect={this.onPublicSelect.bind(this)}
                onPrivateSelect={this.onPrivateSelect.bind(this)}
              />
            </div>

            <div className='col-md-2'>
              {space.user && !space.editableByMe &&
                <a className='ui image label' href={`/users/${space.user.id}`}>
                  <img src={space.user.picture}/>
                  {space.user.name}
                </a>
              }
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
