import React from 'react'
import CanvasStateForm from './canvasStateForm.js'

let SpaceHeader = ({space, onSave}) => (
  <div className='header'>
    <div className='item'>
      <h1> {space ? space.name : ''} </h1>
    </div>

    {space.ownedByMe &&
      <button
          className='ui primary button'
          disabled={!!space.busy}
          onClick={onSave}
      >
        {'Save'}
      </button>
    }
    {!!space.busy &&
      <span className='save-message'>
        {'saving...'}
      </span>
    }

    <div className='item'>
      <CanvasStateForm/>
    </div>
  </div>
)
export default SpaceHeader
