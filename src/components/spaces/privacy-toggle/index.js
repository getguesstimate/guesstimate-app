import React, {Component, PropTypes} from 'react';
import Icon from 'react-fa';
import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
import './style.css';

const PrivacyButton = ({icon, header, children}) => {
  return (
    <div>
      <div className='icon-section'>
        <Icon name={icon}/>
      </div>
      <div className='info-section'>
        <h3> {header} </h3>
        {children}
      </div>
    </div>
  );
}

const PrivacyOption = ({onClick, isSelected, children}) => {
  let className = `PrivacyOption${isSelected ? ' selected' : ''}`;
  return (
    <li
      className={className}
      onClick={onClick}
    >
      {children}
    </li>
  );
}

const PublicOption = ({isSelected, onClick}) => {
  return (
    <PrivacyOption
      isSelected={isSelected}
      onClick={onClick}
    >
      <PrivacyButton
        icon={'globe'}
        header={'Public'}
      >
        This model is visible to everyone. Only you can save changes.
      </PrivacyButton>
    </PrivacyOption>
  );
}

const PrivateOption = ({onClick, isSelected, canMakeMorePrivateModels}) => {
  return (
    <PrivacyOption
      isSelected={isSelected}
      onClick={onClick}
    >
      <PrivacyButton
        icon={'lock'}
        header={'Private'}
      >
        <p> This model is only visible and editable by you. </p>
        {isSelected && (!canMakeMorePrivateModels) &&
          <p className='warning'>
            Upgrade your account to create more private models.
          </p>
        }
      </PrivacyButton>
    </PrivacyOption>
  );
}

class PrivacyToggle extends Component {
  state = {isPublic: true};

  isPublic() {
    return this.state.isPublic;
  }

  handlePrivateSelect() {
    this.setState({isPublic: false});
    this.props.changeValidity(this.props.canMakeMorePrivateModels);
  }

  handlePublicSelect() {
    this.setState({isPublic: true});
    this.props.changeValidity(true);
  }

  render() {
    const {isPublic} = this.state;
    return (
      <ul className='PrivacyToggle'>
        <PublicOption
          isSelected={isPublic}
          onClick={this.handlePublicSelect.bind(this)}
        />
        <PrivateOption
          isSelected={!isPublic}
          onClick={this.handlePrivateSelect.bind(this)}
          canMakeMorePrivateModels={this.props.canMakeMorePrivateModels}
        />
      </ul>
    );
  }
}

const PrivacyButtonDropdown = ({icon, header, children}) => {
  return (
    <div>
      <div className='icon-section'>
        <Icon name={icon}/>
      </div>
      <div className='info-section'>
        <h3> {header} </h3>
        {children}
      </div>
    </div>
  );
}

const PublicOptionDropdown = ({isSelected, onClick}) => {
  return (
    <DropDownListElement
      isSelected={isSelected}
      onMouseDown={onClick}
      icon={'globe'}
      header='Public'
    >
      <p>This model is visible to everyone. Only you can save changes.</p>
    </DropDownListElement>
  );
}

const PrivateOptionDropdown = ({onClick, isSelected, canMakeMorePrivateModels}) => {
  return (
    <DropDownListElement
      isSelected={isSelected}
      onMouseDown={onClick}
      icon={'lock'}
      header='Private'
    >
      <p>This model is only visible and editable by you.</p>
      {isSelected && (!canMakeMorePrivateModels) &&
        <p className='warning'>
          Upgrade your account to create more private models.
        </p>
      }
    </DropDownListElement>
  );
}

class PrivacyToggleDropdown extends Component {
  state = {isPublic: true};

  isPublic() {
    return this.state.isPublic;
  }

  handlePrivateSelect() {
    this.setState({isPublic: false});
    //this.props.changeValidity(this.props.canMakeMorePrivateModels);
  }

  handlePublicSelect() {
    this.setState({isPublic: true});
    //this.props.changeValidity(true);
  }

  render() {
    const {isPublic} = this.state;
    return (
      <ul className='PrivacyToggle dropdown'>
        <PublicOptionDropdown
          isSelected={isPublic}
          onClick={this.handlePublicSelect.bind(this)}
        />
        <PrivateOptionDropdown
          isSelected={!isPublic}
          onClick={this.handlePrivateSelect.bind(this)}
          canMakeMorePrivateModels={this.props.canMakeMorePrivateModels}
        />
      </ul>
    );
  }
};

export {PrivacyToggle, PrivacyToggleDropdown};
