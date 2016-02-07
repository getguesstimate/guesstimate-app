import React, {Component, PropTypes} from 'react'
import Icon from 'react-fa'
import './style.css'

export default class PrivacyOption extends Component {
  render () {
    const {onClick} = this.props
    let className = 'PrivacyOption'
    className += this.props.isSelected ? ' selected' : ''
    return (
      <li
        className={className}
        onClick={onClick}>
        <div className='icon-section'>
          <Icon name={this.props.icon}/>
        </div>
        <div className='info-section'>
          <h3> {this.props.header} </h3>
          <p> {this.props.body} </p>
        </div>
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
        icon={'globe'}
        header={'Public'}
        body={'This will be available to everyone'}
      />
    )
  }
}

export default class PrivateOption extends Component {
  render () {
    return (
      <PrivacyOption
        isSelected={this.props.isSelected}
        onClick={this.props.onClick}
        icon={'lock'}
        header={'Private'}
        body={'This will only be visable to you'}
      />
    )
  }
}


export default class PrivacyToggle extends Component {
  state = {isPublic: false}

  isPublic() {
    return this.state.isPublic
  }

  handlePrivateSelect () {
    this.setState({isPublic: false})
  }

  handlePublicSelect () {
    this.setState({isPublic: true})
  }

  render () {
    const {isPublic} = this.state
    return (
      <ul className='PrivacyToggle'>
        <PublicOption isSelected={isPublic} onClick={this.handlePublicSelect.bind(this)}/>
        <PrivateOption isSelected={!isPublic} onClick={this.handlePrivateSelect.bind(this)}/>
      </ul>
    )
  }
}
