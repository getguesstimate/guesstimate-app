import React, {Component, PropTypes} from 'react'
import Login from'../login'
import './style.css'

const Header = React.createClass({
  displayName: 'Header',
  render () {
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
