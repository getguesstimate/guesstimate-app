import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import './style.css'

import SpaceCanvas from 'gComponents/spaces/canvas'
import SpacesShowHeader from './header.js'
import * as spaceActions from 'gModules/spaces/actions.js'
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';

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

  onSave() {
    this.props.dispatch(spaceActions.update(parseInt(this.props.spaceId)))
  }
  destroy() {
    this.props.dispatch(spaceActions.destroy(this.props.denormalizedSpace))
  }
  render () {
    const space = this.props.denormalizedSpace;
    return (
    <div className='spaceShow'>
      <div className='hero-unit'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-sm-10'>

              {space &&
                <SpacesShowHeader onDestroy={this.destroy.bind(this)}
                    onSave={this.onSave.bind(this)}
                    space={space}
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
      {space && <SpaceCanvas spaceId={space.id}/>}
      </div>
    )
  }
}
