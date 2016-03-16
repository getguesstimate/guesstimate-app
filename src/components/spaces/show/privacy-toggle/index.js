import React, {Component, PropTypes} from 'react'
import DropDown from 'gComponents/utility/drop-down/index.js'
import {CardListElement} from 'gComponents/utility/card/index.js'
import './style.css'

const PublicOption = ({isSelected, onClick}) => {
  return (
    <CardListElement
      isSelected={isSelected}
      onMouseDown={(!isSelected) && onClick}
      icon={'globe'}
      header='Public'
    >
      <div>This model is visible to everyone. Only you can save changes.</div>
    </CardListElement>
  )
}

class PrivateOption extends Component {
  static propTypes = {
    hideErrorWhenUnselected: PropTypes.bool,
    isPrivateSelectionValid: PropTypes.bool,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    hideErrorWhenUnselected: true
  }

  _showWarning() {
    const {isPrivateSelectionValid} = this.props
    return !isPrivateSelectionValid
  }

  render() {
    const {onClick, isSelected, isPrivateSelectionValid} = this.props
    return (
      <CardListElement
        isSelected={isSelected}
        onMouseDown={(!isSelected) && onClick}
        icon={'lock'}
        header='Private'
        isDisabled={!isPrivateSelectionValid}
      >
        <div>This model is only visible and editable by you.</div>
        {this._showWarning() &&
          <div className='warning'>
            Upgrade your account to create more private models.
          </div>
        }
      </CardListElement>
    )
  }
}

class PrivacyToggle extends Component {
  static propTypes = {
    onPrivateSelect: PropTypes.func,
    onPublicSelect: PropTypes.func,
    isPrivate: PropTypes.bool,
    headerText: PropTypes.string,
    position: PropTypes.string,
    isPrivateSelectionValid: PropTypes.bool.isRequired
  }

  render() {
    const {isPrivateSelectionValid, headerText, openLink, position, isPrivate} = this.props

    return (
      <DropDown
          headerText={headerText}
          openLink={openLink}
          position={position}
          width={'wide'}
      >
        <ul className={`PrivacyToggle dropdown`}>
          <PublicOption
            isSelected={!isPrivate}
            onClick={this.props.onPublicSelect}
          />
          <PrivateOption
            isSelected={isPrivate}
            onClick={this.props.onPrivateSelect}
            isPrivateSelectionValid={isPrivateSelectionValid}
            hideErrorWhenUnselected={false}
          />
        </ul>
      </DropDown>
    )
  }
}

export {PrivacyToggle}
