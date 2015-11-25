import React from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import CanvasViewForm from './canvasViewForm.js'
import Icon from 'react-fa'

import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'

let SpaceHeader = ({space, onSave, onDestroy}) => (
  <div className='header'>
    <h1> {space ? space.name : ''} </h1>

    <CanvasViewForm/>

    {space.ownedByMe &&
      <DropDown
          headerText={'Topic Actions'}
          openLink={<a className='space-header-action'>Topic Actions</a>}
          position='right'
      >
        <ul>
          <DropDownListElement icon={'warning'} text='Delete Topic' />
        </ul>
      </DropDown>
    }

    {space.ownedByMe &&
      <a disabled={!!space.busy} onClick={onSave} className='space-header-action'>
        {'Save'}
      </a>
    }
    {!!space.busy &&
      <span className='save-message'>
        {'saving...'}
      </span>
    }

  </div>
)
export default SpaceHeader
