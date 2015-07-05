import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import MenuItem from 'react-bootstrap/MenuItem'
import NavHelper from '../components/nav-helper'

const Header = React.createClass({
  displayName: 'Header',
  render () {
    let containerClass = (this.props.isFluid === true) ? "container-fluid" : "container";
    return (
      <nav className="navbar navbar-default">
        <div className={containerClass}>
          <div className="navbar-header">
            <a className="navbar-brand" href="/">Guestimate</a>
          </div>
          <ul className="nav navbar-nav">
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="/model">Model</a></li>
          </ul>
        </div>{/* /.container-fluid */}
      </nav>
    );
  }
});

export default React.createClass({
  displayName: 'Layout',
  render () {
    return (
      <NavHelper>
        <div>
            <Header isFluid={this.props.isFluid}/>
            {this.props.children}
        </div>
      </NavHelper>
    )
  }
})
