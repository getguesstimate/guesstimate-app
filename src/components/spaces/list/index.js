import React from 'react'
import SpaceListItem from '../list_item'
import './style.css'

const SpaceList = ({spaces, showUsers}) => (
  <div className='SpaceList'>
    {spaces.map((s) => {
      return (
        <SpaceListItem
            key={s.id}
            spaceId={s.id}
            showUser={showUsers}
        />
      )
    })}
  </div>
)

export default SpaceList
