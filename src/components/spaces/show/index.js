import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import './style.css'

import SpaceCanvas from 'gComponents/spaces/canvas'
import SpacesShowHeader from './header.js'
import * as spaceActions from 'gModules/spaces/actions.js'
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import SpaceSidebar from './sidebar.js'
import ClosedSpaceSidebar from './closed_sidebar.js'
import e from 'gEngine/engine'

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
    spaceId: PT.string,
    denormalizedSpace: PT.object,
  }

  state = {
    showSidebar: true,
    attemptedFetch: false
  }

  componentWillMount() {
    this.considerFetch(this.props)
  }

  componentDidUpdate(newProps) {
    this.considerFetch(newProps)
  }

  considerFetch(newProps) {
    const space = newProps.denormalizedSpace
    const isPublic = space && !space.is_private
    const needsData = !_.has(space, 'graph')
    const loggedIn = e.me.isLoggedIn(newProps.me)

    if (needsData && (isPublic || loggedIn)) {
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
  render () {
    const space = this.props.denormalizedSpace;
    const sidebarIsViseable = !!space && (space.ownedByMe || !_.isEmpty(space.description))
    const canUsePrivateModels = e.me.canUsePrivateModels(this.props.me)
    return (
    <div className='spaceShow'>
      <div className='hero-unit'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-sm-10'>

              {space &&
                <SpacesShowHeader onDestroy={this.destroy.bind(this)}
                    onSaveName={this.onSaveName.bind(this)}
                    onSave={this.onSave.bind(this)}
                    onDestroy={this.destroy.bind(this)}
                    space={space}
                    canUsePrivateModels={canUsePrivateModels}
                />
              }
            </div>

            <div className='col-sm-2'>

              {space && space.user && !space.ownedByMe &&
                <div>
                  <a className='ui image label' href={`/users/${space.user.id}`}>
                    <img  src={space.user.picture}/>
                    {space.user.name}
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className='content'>
        {sidebarIsViseable && this.state.showSidebar &&
          <SpaceSidebar
              space={space}
              onClose={this.hideSidebar.bind(this)}
              onSaveDescription={this.onSaveDescription.bind(this)}
          />
        }
        {sidebarIsViseable && !this.state.showSidebar &&
          <ClosedSpaceSidebar onOpen={this.openSidebar.bind(this)}/>
        }
        {space && <SpaceCanvas spaceId={space.id}/>}
      </div>
      </div>
    )
  }
}
