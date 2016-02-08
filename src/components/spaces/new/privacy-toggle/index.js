import React, {Component, PropTypes} from 'react'
import Icon from 'react-fa'
import './style.css'

export default class PrivacyButton extends Component {
  render() {
    return(
      <div>
        <div className='icon-section'>
          <Icon name={this.props.icon}/>
        </div>
        <div className='info-section'>
          <h3> {this.props.header} </h3>

          {this.props.children}
        </div>
      </div>
    )
  }
}

export default class PrivacyOption extends Component {
  render () {
    const {onClick} = this.props
    let className = 'PrivacyOption'
    className += this.props.isSelected ? ' selected' : ''
    return (
      <li
        className={className}
        onClick={onClick}>
        {this.props.children}
      </li>
    )
  }
}

export default class PublicOption extends Component {
  render () {
    return (
      <PrivacyOption
        isSelected={this.props.isSelected}
        onClick={this.props.onClick}
      >
        <PrivacyButton
          icon={'globe'}
          header={'Public'}
        >
        This model is visable to everyone. Only you can save changes.
      </PrivacyButton>
      </PrivacyOption>
    )
  }
}

export default class PrivateOption extends Component {
  render () {
    const {onClick, isSelected, canMakeMorePrivateModels} = this.props
    return (
      <PrivacyOption
        isSelected={isSelected}
        onClick={onClick}
      >
        <PrivacyButton
        icon={'lock'}
        header={'Private'}
        >
          <p> This model is only visable and editable by you. </p>
          {isSelected && (!canMakeMorePrivateModels) &&
            <p className='warning'> Upgrade your account to create more private models. </p>
          }
        </PrivacyButton>


      </PrivacyOption>
    )
  }
}


export default class PrivacyToggle extends Component {
  state = {isPublic: true}

  isPublic() {
    return this.state.isPublic
  }

  handlePrivateSelect () {
    this.setState({isPublic: false})
    this.props.changeValidity(this.props.canMakeMorePrivateModels)
  }

  handlePublicSelect () {
    this.setState({isPublic: true})
    this.props.changeValidity(true)
  }

  render () {
    const {isPublic} = this.state
    return (
      <ul className='PrivacyToggle'>
        <PublicOption isSelected={isPublic} onClick={this.handlePublicSelect.bind(this)}/>
        <PrivateOption
          isSelected={!isPublic}
          onClick={this.handlePrivateSelect.bind(this)}
          canMakeMorePrivateModels={this.props.canMakeMorePrivateModels}
        />
      </ul>
    )
  }
}
