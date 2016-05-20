import React from 'react'
import './style.css'
import moment from 'moment'
import removeMd from 'remove-markdown'

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

let BlankScreenshot = ({isPrivate}) => (
  <div className='snapshot blank'>
    {!isPrivate && <img src={arrowsVisibleImage}/>}
    {isPrivate && <Icon name='lock'/>}
  </div>
)

const SpaceCard = ({space}) => {
  const hasName = !_.isEmpty(space.name)
  const className = `text-editable ${hasName ? '' : 'default-value'}`
  const showName = hasName ? space.name : 'Untitled Model'
  return (
    <div className='col-md-4'>
      <div className='SpaceCard'>
        <div className='header'>
          <h3>{space.name}</h3>
          <div className='changed-at'>Updateed {formatDate(space.updated_at)}</div>
        </div>

        <div className='image'>
          <img src={space.big_screenshot} />
          {space.user &&
          <div className='user-tag'>
            <img
                className='avatar'
                src={space.user.picture}
            />
            <div className='name'>
            {space.user.name}
            </div>
          </div>
          }
        </div>
        <div className='body'>
          <p> {formatDescription(space.description)} </p>
        </div>
      </div>
    </div>
  )
}

const SpaceList = ({spaces, hasMorePages, loadMore}) => (
  <div className='Cards row'>
    {_.map(spaces, (s) => {
      return (
        <SpaceCard
          key={s.id}
          spaceId={s.id}
          space={s}
        />
      )
    })}
    {!!spaces.length && hasMorePages &&
      <div className='nextPage'>
        <button className={'ui button nextpage'} onClick={loadMore}> {'Load More'} </button>
      </div>
    }
  </div>
)

export default SpaceList
