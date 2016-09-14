import React from 'react'

import DropDown from 'gComponents/utility/drop-down/index.js'
import {CardListElement} from 'gComponents/utility/card/index.js'

import * as navigationActions from 'gModules/navigation/actions.js'

import './style.css'

const ShareableLinkOption = ({shareableLinkUrl, onEnable, onRotate, onDisable}) => (
  <CardListElement
    isSelected={false}
    icon={'link'}
    header='Shareable Link'
    closeOnClick={false}
  >
    <div>ShareableLink</div>
  </CardListElement>
)

const PublicOption = ({isSelected, onClick}) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={(!isSelected) && onClick}
    icon={'globe'}
    header='Public'
    closeOnClick={!isSelected}
  >
    <div>This model is visible to everyone. Only you can save changes.</div>
  </CardListElement>
)

const PrivateOption = ({onClick, isSelected, isPrivateSelectionInvalid, editableByMe}) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={(!isSelected) && onClick}
    icon={'lock'}
    header='Private'
    isDisabled={isPrivateSelectionInvalid}
    closeOnClick={!isSelected}
  >
    <div>
      {editableByMe ? 'This model is only visible and editable by you.' : 'You have been given view access to this model.'}
    </div>
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

export const PrivacyToggle = ({
  editableByMe,
  isPrivateSelectionInvalid,
  openLink,
  isPrivate,
  shareableLinkUrl,
  onPublicSelect,
  onPrivateSelect,
  onEnableShareableLink,
  onDisableShareableLink,
  onRotateShareableLink,
}) => (
  <DropDown
      headerText={'Privacy Options'}
      openLink={openLink}
      position={'left'}
      width={'wide'}
  >
    {(!isPrivate || editableByMe) &&
      <PublicOption
        isSelected={!isPrivate}
        onClick={onPublicSelect}
      />
    }
    {(isPrivate || editableByMe) &&
      <PrivateOption
        isSelected={isPrivate}
        onClick={onPrivateSelect}
        isPrivateSelectionInvalid={isPrivateSelectionInvalid}
        hideErrorWhenUnselected={false}
      />
    }
    {isPrivate && editableByMe &&
      <ShareableLinkOption
        shareableLinkUrl={shareableLinkUrl}
        onEnable={onEnableShareableLink}
        onDisable={onDisableShareableLink}
        onRotate={onRotateShareableLink}
      />
    }
  </DropDown>
)
