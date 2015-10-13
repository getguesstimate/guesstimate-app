import React, {Component, PropTypes} from 'react'

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
    console.log("you clicked omethign")
  }

  wrappedToggleButton() {
    return (<span onClick={this.toggle.bind(this)}>{this.props.toggleButton}</span>)
  }
  render() {
    let menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close.bind(this),
      toggle: this.wrappedToggleButton(),
      align: 'right',
      animate: false,
      children: this.props.children
    };
    return (
      <DropdownMenu {...menuOptions}/>
    );
  }
}
