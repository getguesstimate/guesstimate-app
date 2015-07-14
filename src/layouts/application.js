import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import MenuItem from 'react-bootstrap/MenuItem'
import NavHelper from '../components/nav-helper'
import Icon from'react-fa'

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
            <li><a href="/repo/new"><Icon name='plus'/></a></li>
          </ul>
        </div>{/* /.container-fluid */}
      </nav>
    );
  }
});

export default React.createClass({
  displayName: 'Layout',
  render () {
    let body = this.props.children
    if (!this.props.isFluid) {
      body = <div className="container"> {body} </div>
    }
    return (
      <NavHelper>
        <div>
            <Header isFluid={this.props.isFluid}/>
            {body}
        </div>
      </NavHelper>
    )
  }
})
