import React from 'react'
import Icon from'react-fa'

import arrowsVisibleImage from '../../../assets/metric-icons/blue/arrows-visible.png'
import {formatDescription, formatDate} from 'gComponents/spaces/shared'
import './style.css'

import * as navigationActions from 'gModules/navigation/actions.js'
import * as Space from 'gEngine/space';
import * as User from 'gEngine/user';

let BlankScreenshot = () => (
  <div className='snapshot blank'>
    <img src={arrowsVisibleImage}/>
  </div>
)

let SingleButton = ({isPrivate}) => (
  <div className='tag'>
    <Icon name={isPrivate ? 'lock' : 'globe'}/>
  </div>
)

let ButtonArea = ({user, navigateToUser, isPrivate, showPrivacy}) => (
  <div className='hover-row'>
    {user &&
    <div className='user-tag' onClick={navigateToUser}>
      <img
          className='avatar'
          src={user.picture}
      />
      <div className='name'>
      {user.name}
      </div>
    </div>
    }
    {showPrivacy && <SingleButton isPrivate={isPrivate}/>}
  </div>
)

const SpaceCard = ({space, showPrivacy}) => {
  const hasName = !_.isEmpty(space.name)
  const navigateToSpace = () => {navigationActions.navigate(Space.url(space))}
  const navigateToUser = () => {navigationActions.navigate(User.url(space.user))}
  return (
    <div className='col-md-4 SpaceCard'>
      <div className='SpaceCard--inner'>
        <div className={`header ${hasName ? '' : 'default-name'}`}>
          <h3 onClick={navigateToSpace}>{hasName ? space.name : 'Untitled Model'}</h3>
          <div className='changed-at'>Updated {formatDate(space.updated_at)}</div>
        </div>

        <div className='image'>
          <BlankScreenshot/>
          <img src={space.big_screenshot} onClick={navigateToSpace} />
          <ButtonArea
            user={space.user}
            navigateToUser={navigateToUser}
            isPrivate={space.is_private}
            showPrivacy={showPrivacy}
          />
        </div>
        <div className='body'>
          <p> {formatDescription(space.description)} </p>
        </div>
      </div>
    </div>
  )
}

const SpaceCards = ({spaces, showPrivacy}) => (
  <div className='row'>
    {_.map(spaces, (s) =>
        <SpaceCard
          key={s.id}
          space={s}
          showPrivacy={showPrivacy}
        />
    )}
  </div>
)

export default SpaceCards
