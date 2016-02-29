import React, {Component, PropTypes} from 'react'
import Icon from 'react-fa'
import DropDown from 'gComponents/utility/drop-down/index.js'
import Card from 'gComponents/utility/card/index.js'
import {CardListElement} from 'gComponents/utility/card/index.js'
import './style.css'

const PublicOption = ({isSelected, onClick}) => {
  return (
    <CardListElement
      isSelected={isSelected}
      onMouseDown={onClick}
      icon={'globe'}
      header='Public'
    >
      <p>This model is visible to everyone. Only you can save changes.</p>
    </CardListElement>
  )
}

const PrivateOption = ({onClick, isSelected, isPrivateSelectionValid}) => {
  return (
    <CardListElement
      isSelected={isSelected}
      onMouseDown={onClick}
      icon={'lock'}
      header='Private'
    >
      <p>This model is only visible and editable by you.</p>
      {isSelected && (!isPrivateSelectionValid) &&
        <p className='warning'>
          Upgrade your account to create more private models.
        </p>
      }
    </CardListElement>
  )
}

class PrivacyToggle extends Component {
  static propTypes = {
    onPrivateSelect: PropTypes.func,
    onPublicSelect: PropTypes.func,
    initialSelection: PropTypes.oneOf(['Public', 'Private']),
    isDropDown: PropTypes.bool,
    headerText: PropTypes.string,
    position: PropTypes.string,
    isPrivateSelectionValid: PropTypes.bool.isRequired
  }

  static defaultProps = {
    initialSelection: 'Public',
  }

  state = {isPublicSelected: this.props.initialSelection === 'Public'}

  isPublicSelected() {
    return this.state.isPublicSelected
  }

  onPrivateSelect() {
    this.setState({isPublicSelected: false})
    this.props.onPrivateSelect()
  }

  onPublicSelect() {
    this.setState({isPublicSelected: true})
    this.props.onPublicSelect()
  }

  render() {
    const {isPublicSelected} = this.state
    const {isPrivateSelectionValid, isDropDown, headerText, openLink, position} = this.props

    const list = (
      <ul className={`PrivacyToggle${isDropDown ? ' dropdown' : ''}`}>
        <PublicOption
          isSelected={isPublicSelected}
          onClick={this.onPublicSelect.bind(this)}
        />
        <PrivateOption
          isSelected={!isPublicSelected}
          onClick={this.onPrivateSelect.bind(this)}
          isPrivateSelectionValid={isPrivateSelectionValid}
        />
      </ul>
    )

    if (isDropDown) {
      return (
        <DropDown
            headerText={headerText}
            openLink={openLink}
            position={position}
        >
          {list}
        </DropDown>
      )
    } else {
      return (
        <Card headerText={headerText}>
          {list}
        </Card>
      )
    }
  }
}

export {PrivacyToggle}
