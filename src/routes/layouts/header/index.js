import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import Login from'../login'
import './style.css'

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
