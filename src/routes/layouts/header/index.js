import React, {Component, PropTypes} from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Icon from'react-fa'
import Login from'../login'
import './style.css'

const NavItem = React.createClass({
  render () {
    return (
    <ButtonGroup>
        <DropdownButton title='Example Guesstimates' id='split-button-pull-right'>
         {this.props.spaces.asMutable().map((space) => {
              return (
                <MenuItem href={Space.url(space)} key={space.id}>{space.name}</MenuItem>
              )
          })}
        </DropdownButton>
        <Button href="/space/new"><Icon name='plus'/></Button>
      </ButtonGroup>
    )
  }
})

const Header = React.createClass({
  displayName: 'Header',
  render () {
    let containerClass = (this.props.isFluid === true) ? "container-fluid" : "container";
    return (
      <div className='PageHeader'>
        <div className='container-fluid'>
          <div className="ui secondary menu">
              <div className='header item'>
                <a className="navbar-brand" href="/">
                  Guesstimate
                </a>
              </div>
              <Login/>
          </div>
        </div>
      </div>
    );
  }
});

export default Header;
