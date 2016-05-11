import React from 'react'
import SpaceListItem from '../list_item'
import './style.css'

const SpaceList = ({spaces, showUsers, loadMore, hasMorePages}) => (
  <div className='SpaceList'>
    {_.map(spaces, (s) => {
      return (
        <SpaceListItem
            key={s.id}
            spaceId={s.id}
            space={s}
            showUser={showUsers}
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
