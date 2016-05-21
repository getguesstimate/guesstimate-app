import React from 'react'
import Icon from'react-fa'
import './style.css'
import moment from 'moment'
import removeMd from 'remove-markdown'
import * as navigationActions from 'gModules/navigation/actions.js'
import * as Space from 'gEngine/space';
import * as User from 'gEngine/user';
import arrowsVisibleImage from '../../../assets/metric-icons/blue/arrows-visible.png'

function formatDescription(description) {
  const maxLength = 300

  if (_.isEmpty(description)){ return '' }

  const withoutMarkdown = removeMd(description)
  if (withoutMarkdown.length < maxLength) { return withoutMarkdown }

  const truncated = withoutMarkdown.substring(0, maxLength)
  return `${truncated}...`
}

function formatDate(date) {
 return moment(new Date(date)).format('ll')
}

let PrivateTag = ({isPrivate}) => (
  <div className='col-xs-12'>
    <div className='privacy-tag'>
      <Icon name={isPrivate ? 'lock' : 'globe'}/>
      {isPrivate ? 'Private' : 'Public'}
    </div>
  </div>
)

let BlankScreenshot = () => (
  <div className='snapshot blank'>
    <img src={arrowsVisibleImage}/>
  </div>
)

let MinorButton = ({isPrivate}) => (
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
    {showPrivacy && <MinorButton isPrivate={isPrivate}/>}
  </div>
)

const SpaceCard = ({space, showPrivacy}) => {
  const hasName = !_.isEmpty(space.name)
  const navigateToSpace = () => {navigationActions.navigate(Space.url(space))}
  const navigateToUser = () => {navigationActions.navigate(User.url(space.user))}
  return (
    <div className='col-md-4 SpaceCard-same-height'>
      <div className='SpaceCard'>
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

const SpaceCards = ({spaces, hasMorePages, loadMore, showPrivacy}) => (
  <div className='Cards row'>
    {_.map(spaces, (s) => {
      return (
        <SpaceCard
          key={s.id}
          space={s}
          showPrivacy={showPrivacy}
        />
      )
    })}
    {!!spaces.length && hasMorePages &&
      <div className='nextPage'>
        <button className={'ui button nextpage large'} onClick={loadMore}> {'Load More'} </button>
      </div>
    }
  </div>
)

export default SpaceCards
