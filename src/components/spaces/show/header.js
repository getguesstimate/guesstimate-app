import React from 'react'
import CanvasStateForm from './canvasStateForm.js'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import Icon from 'react-fa'

let SpaceHeader = ({space, onSave, onDestroy}) => (
  <div className='header'>
    <h1> {space ? space.name : ''} </h1>

    {space.ownedByMe &&
      <StandardDropdownMenu toggleButton={<a><Icon name='cog'/> Actions </a>}>
          <li key='1' onMouseDown={onDestroy}><button type='button'>Delete</button></li>
      </StandardDropdownMenu>
    }

    {space.ownedByMe &&
      <a disabled={!!space.busy} onClick={onSave}>
        {'Save'}
      </a>
    }
    {!!space.busy &&
      <span className='save-message'>
        {'saving...'}
      </span>
    }

    <CanvasStateForm/>
  </div>
)
export default SpaceHeader
