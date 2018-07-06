import React, {Component} from 'react' 
import PropTypes from 'prop-types'

import DropdownMenu from 'react-dd-menu'

export default class StandardDropdownMenu extends Component {
  state = {
    isMenuOpen: false
  }

  toggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen })
  }

  close() {
    this.setState({ isMenuOpen: false })
  }

  click() {
  }

  wrappedToggleButton() {
    return (<span onClick={this.toggle.bind(this)}>{this.props.toggleButton}</span>)
  }

  render() {
    let menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close.bind(this),
      toggle: this.wrappedToggleButton(),
      align: 'left',
      animate: true,
      animAlign: 'center',
      children: this.props.children
    };
    return (
      <DropdownMenu {...menuOptions}/>
    );
  }
}
