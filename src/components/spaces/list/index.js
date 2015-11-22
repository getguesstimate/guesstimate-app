import React from 'react'
import SpaceListItem from '../list_item'
import './style.css'

const SpaceList = ({spaces, showUsers, loadMore, hasMorePages}) => (
  <div className='SpaceList'>
    {spaces.map((s) => {
      return (
        <SpaceListItem
            key={s.id}
            spaceId={s.id}
            space={s}
            showUser={showUsers}
        />
      )
    })}
    {hasMorePages &&
      <button className={'ui button'} onClick={loadMore}> {'More'} </button>
    }
  </div>
)

export default SpaceList
