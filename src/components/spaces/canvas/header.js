import React from 'react'

let SpaceHeader = ({space, onSave}) => (
  <div className='header'>
    <div className='btn btn-large btn-primary'
         disabled={!!space.busy}
         onClick={onSave}
    >
      {'Save'}
    </div>
    {!!space.busy &&
      <span className='save-message'>
        {'saving...'}
      </span>
    }
  </div>
)
export default SpaceHeader
