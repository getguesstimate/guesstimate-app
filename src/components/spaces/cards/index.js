import React from 'react'

import Icon from'react-fa'

import * as navigationActions from 'gModules/navigation/actions'

import * as Space from 'gEngine/space'
import * as User from 'gEngine/user'
import * as Organization from 'gEngine/organization'

import {formatDescription, formatDate} from 'gComponents/spaces/shared'

import arrowsVisibleImage from '../../../assets/metric-icons/blue/arrows-visible.png'

import './style.css'

const BlankScreenshot = () => (
  <div className='snapshot blank'>
    <img src={arrowsVisibleImage}/>
  </div>
)

const SingleButton = ({isPrivate}) => (
  <div className='tag'>
    <Icon name={isPrivate ? 'lock' : 'globe'}/>
  </div>
)

const ButtonArea = ({owner, navigateToOwner, isPrivate, showPrivacy}) => (
  <div className='hover-row'>
    {owner &&
      <div className='owner-tag' onClick={navigateToOwner}>
        {!!owner.picture &&
          <img
            className='avatar'
            src={owner.picture}
          />
        }
        <div className='name'>
          {owner.name}
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
  const navigateToOrganization = () => {navigationActions.navigate(Organization.url(space.organization))}

  const owner = !!space.organization ? space.organization : space.user
  const navigateToOwner = !!space.organization ? navigateToOwner : navigateToUser

  return (
    <div className='col-xs-12 col-md-4 SpaceCard'>
      <div className='SpaceCard--inner'>
        <div className={`header ${hasName ? '' : 'default-name'}`}>
          <h3 onClick={navigateToSpace}>{hasName ? space.name : 'Untitled Model'}</h3>
          <div className='changed-at'>Updated {formatDate(space.updated_at)}</div>
        </div>

        <div className='image'>
          <BlankScreenshot/>
          <img src={space.big_screenshot} onClick={navigateToSpace} />
          <ButtonArea
            owner={owner}
            navigateToOwner={navigateToOwner}
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
