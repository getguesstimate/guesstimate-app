import React from 'react'

let SpaceHeader = ({space, onSave}) => (
  <div className='header'>

    {space.ownedByMe &&
      <button className='ui primary button' disabled={!!space.busy} onClick={onSave}>
        {'Save'}
      </button>
    }
    {!space.ownedByMe &&
      <p> {'As a non-owner, you can edit, but you can not save'} </p>
    }
    {!!space.busy &&
      <span className='save-message'>
        {'saving...'}
      </span>
    }
  </div>
)
export default SpaceHeader
