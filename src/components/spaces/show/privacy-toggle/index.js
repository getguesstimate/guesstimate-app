import React from 'react'

import DropDown from 'gComponents/utility/drop-down/index.js'
import {CardListElement} from 'gComponents/utility/card/index.js'

import * as navigationActions from 'gModules/navigation/actions.js'

import './style.css'

const PublicOption = ({isSelected, onClick}) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={(!isSelected) && onClick}
    icon={'globe'}
    header='Public'
  >
    <div>This model is visible to everyone. Only you can save changes.</div>
  </CardListElement>
)

const PrivateOption = ({onClick, isSelected, isPrivateSelectionInvalid}) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={(!isSelected) && onClick}
    icon={'lock'}
    header='Private'
    isDisabled={isPrivateSelectionInvalid}
  >
    <div>This model is only visible and editable by you.</div>
    {isPrivateSelectionInvalid &&
      <div className='warning'>
        <span className='upgrade' onClick={() => navigationActions.navigate('/pricing')}>
          Upgrade
        </span>
        {' for more private models.'}
      </div>
    }
  </CardListElement>
)

export const PrivacyToggle = ({isPrivateSelectionInvalid, onPublicSelect, onPrivateSelect, headerText, openLink, position, isPrivate}) => (
  <DropDown
      headerText={headerText}
      openLink={openLink}
      position={position}
      width={'wide'}
  >
    <ul className={`PrivacyToggle dropdown`}>
      <PublicOption
        isSelected={!isPrivate}
        onClick={onPublicSelect}
      />
      <PrivateOption
        isSelected={isPrivate}
        onClick={onPrivateSelect}
        isPrivateSelectionInvalid={isPrivateSelectionInvalid}
        hideErrorWhenUnselected={false}
      />
    </ul>
  </DropDown>
)
