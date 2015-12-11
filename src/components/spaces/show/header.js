import React from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import CanvasViewForm from './canvasViewForm.js'
import Icon from 'react-fa'

import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
import {SpaceName} from './spaceName.js'

let SpaceHeader = ({space, onSave, onDestroy, onSaveName}) => (
  <div className='header'>

    <div className='header-name'>
      {space.name &&
        <SpaceName
            name={space.name}
            ownedByMe={space.ownedByMe}
            onSave={onSaveName}
        />
      }
    </div>

    <div className='header-actions'>
      <CanvasViewForm/>

      {space.ownedByMe &&
        <DropDown
            headerText={'Model Actions'}
            openLink={<a className='space-header-action'>Model Actions</a>}
            position='right'
        >
          <ul>
            <DropDownListElement icon={'warning'} text='Delete Model' onMouseDown={onDestroy}/>
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
  </div>
)
export default SpaceHeader
