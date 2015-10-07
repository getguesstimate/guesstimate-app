import React from 'react'

let SpaceHeader = ({space, onSave}) => (
  <div className='header'>

    <button className='ui primary button' disabled={!!space.busy} onClick={onSave}>
      {'Save'}
    </button>
    {!!space.busy &&
      <span className='save-message'>
        {'saving...'}
      </span>
    }
  </div>
)
export default SpaceHeader
