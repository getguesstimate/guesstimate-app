import React from 'react'
import SpaceListItem from '../list_item'
import './style.css'

const SpaceList = ({spaces, showUsers, showOrganizations, loadMore, hasMorePages}) => (
  <div className='SpaceList'>
    {spaces.map((s) => {
      return (
        <SpaceListItem
            key={s.id}
            spaceId={s.id}
            space={s}
            showUser={showUsers}
            showOrganization={showOrganizations}
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
