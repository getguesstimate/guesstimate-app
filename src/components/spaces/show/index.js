import React, {Component, PropTypes} from 'react'
import SpaceCanvas from 'gComponents/spaces/canvas'
import { connect } from 'react-redux';
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import style from './style.css'
import * as spaceActions from 'gModules/spaces/actions.js'
import Icon from 'react-fa'
import CanvasShowHeader from './header.js'
import _ from 'lodash'

function mapStateToProps(state) {
  return {
    me: state.me,
  }
}

@connect(mapStateToProps)
@connect(denormalizedSpaceSelector)
export default class CanvasShow extends Component {
  displayName: 'RepoDetailPage'
  onSave() {
    this.props.dispatch(spaceActions.update(parseInt(this.props.spaceId)))
  }
  destroy() {
    this.props.dispatch(spaceActions.destroy(this.props.denormalizedSpace))
  }
  render () {
    const space = this.props.denormalizedSpace;
    return (
    <div>
      <div className='hero-unit'>
        <div className='container-fluid'>
          <div className='ui secondary menu'>

            <div className='item'>
              <h1> {space ? space.name : ''} </h1>
            </div>

            {space && space.ownedByMe &&
              <CanvasShowHeader space={space} onSave={this.onSave.bind(this)} onDestroy={this.destroy.bind(this)}/>
            }

            <div className='right  menu'>
            {space && space.user && !space.ownedByMe &&
              <div>
                <a className='ui image label'>
                  <img  src={space.user.picture}/>
                  {space.user.name}
                </a>
              </div>
            }

            </div>
          </div>
        </div>
      </div>
      { space && <SpaceCanvas spaceId={space.id}/>}
      </div>
    )
  }
}
