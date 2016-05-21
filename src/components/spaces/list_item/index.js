import React, {Component} from 'react'
import { connect } from 'react-redux';
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import MetricLabel from '../../metrics/label'
import arrowsVisibleImage from '../../../assets/metric-icons/blue/arrows-visible.png'
import {formatDescription, formatDate} from 'gComponents/spaces/shared'

import * as Space from 'gEngine/space';
import './style.css'
import moment from 'moment'
import Icon from 'react-fa'
import removeMd from 'remove-markdown'
import e from 'gEngine/engine'

let PrivateTag = ({isPrivate}) => (
  <div className='col-xs-12'>
    <div className='privacy-tag'>
      <Icon name={isPrivate ? 'lock' : 'globe'}/>
      {isPrivate ? 'Private' : 'Public'}
    </div>
  </div>
)

let BlankScreenshot = ({isPrivate}) => (
  <div className='snapshot blank'>
    {!isPrivate && <img src={arrowsVisibleImage}/>}
    {isPrivate && <Icon name='lock'/>}
  </div>
)

const SpaceListItem = ({space, showUser, isOwnedByMe, showScreenshot}) => {
  const hasName = !_.isEmpty(space.name)
  const className = `text-editable ${hasName ? '' : 'default-value'}`
  const showName = hasName ? space.name : 'Untitled Model'
  return(
    <div className='SpaceListItem'>
      <a href={Space.url(space)}>
        <div className='row'>
          {showScreenshot &&
            <div className='col-sm-3'>
              {space.screenshot && <div className='snapshot'> <img src={space.screenshot} /> </div> }
              {!space.screenshot && <BlankScreenshot isPrivate={space.is_private}/>}

            </div>
          }
          <div className={`col-sm-${showScreenshot ? 9 : 12}`}>
            <div className='row'>
              <div className='col-xs-9'>
                <h3 className={className}> {showName} </h3>
                <p>Updated {formatDate(space.updated_at)}</p>
              </div>
              <div className='col-xs-3'>
                <div className='row'>
                  {space.user && showUser &&
                    <div className='col-xs-12'>
                      <div className='user-tag'>
                        <img
                            className='ui avatar image'
                            src={space.user.picture}
                        />
                        {space.user.name}
                      </div>
                    </div>
                  }

                  {isOwnedByMe && <PrivateTag isPrivate={space.is_private}/>}
                </div>
              </div>
            </div>

            {!_.isEmpty(space.description) &&
              <div className='row description'>
                <div className='col-xs-12'>
                  <p> {formatDescription(space.description)} </p>
                </div>
              </div>
            }
          </div>
        </div>
      </a>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    spaces: state.spaces,
    me: state.me
  }
}

@connect(mapStateToProps)
@connect(denormalizedSpaceSelector)
export default class SpaceListItemComponent extends Component {
  render() {
    const isOwnedByMe = e.me.isOwnedByMe(this.props.me, this.props.denormalizedSpace)
    if (!!this.props.denormalizedSpace){
      return (
        <SpaceListItem
          space={this.props.denormalizedSpace}
          showUser={this.props.showUser}
          isOwnedByMe={isOwnedByMe}
          showScreenshot={this.props.showScreenshot}
        />
      )
    } else {
      return false
    }
  }
}

