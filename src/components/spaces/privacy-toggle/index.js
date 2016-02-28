import React, {Component, PropTypes} from 'react';
import Icon from 'react-fa';
import DropDown from 'gComponents/utility/drop-down/index.js'
import Card from 'gComponents/utility/card/index.js'
import {CardListElement} from 'gComponents/utility/card/index.js'
import './style.css';

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
  );
}

const PrivateOption = ({onClick, isSelected, canMakeMorePrivateModels}) => {
  return (
    <CardListElement
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
    </CardListElement>
  );
}

class PrivacyToggle extends Component {
  static propTypes = {
    onPrivateSelect: PropTypes.func,
    onPublicSelect: PropTypes.func,
    startPublic: PropTypes.bool,
    dropdown: PropTypes.bool,
    headerText: PropTypes.string,
    canMakeMorePrivateModels: PropTypes.bool.isRequired
  }

  static defaultProps = {
    startPublic: true,
  }

  /* TODO(matt): isPublic -> publicSelected ?*/
  state = {isPublic: this.props.startPublic};

  isPublic() {
    return this.state.isPublic;
  }

  onPrivateSelect() {
    this.setState({isPublic: false});
    this.props.onPrivateSelect();
  }

  onPublicSelect() {
    this.setState({isPublic: true});
    this.props.onPublicSelect();
  }

  render() {
    const {isPublic} = this.state;
    const {canMakeMorePrivateModels, dropdown, headerText, openLink, position} = this.props;

    const list = (
      <ul className={`PrivacyToggle${dropdown ? ' dropdown' : ''}`}>
        <PublicOption
          isSelected={isPublic}
          onClick={this.onPublicSelect.bind(this)}
        />
        <PrivateOption
          isSelected={!isPublic}
          onClick={this.onPrivateSelect.bind(this)}
          canMakeMorePrivateModels={canMakeMorePrivateModels}
        />
      </ul>
    );

    if (dropdown) {
      return (
        <DropDown
            headerText={headerText}
            openLink={openLink}
            position={position}
        >
          {list}
        </DropDown>
      );
    } else {
      return (
        <Card headerText={headerText}>
          {list}
        </Card>
      );
    }
  }
}

export {PrivacyToggle};
