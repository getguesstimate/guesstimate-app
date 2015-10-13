import React, {Component, PropTypes} from 'react'
import SpaceCanvas from 'gComponents/spaces/canvas'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import { connect } from 'react-redux';
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import style from './style.css'
import * as spaceActions from 'gModules/spaces/actions.js'
import '../../../../node_modules/react-dd-menu/dist/react-dd-menu.min.css'
import Icon from 'react-fa'

@connect(denormalizedSpaceSelector)
export default class CanvasShow extends Component {
  displayName: 'RepoDetailPage'
  destroy() {
    this.props.dispatch(spaceActions.destroy(this.space()))
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
            <div className='item'>
            <StandardDropdownMenu toggleButton={<a href=''> Settings </a>}>
                <li><a href='' onClick={this.destroy.bind(this)}> Delete </a></li>
              </StandardDropdownMenu>
            </div>
            <div className='right  menu'>

        {space && space.user &&
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
