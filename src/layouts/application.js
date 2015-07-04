import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import MenuItem from 'react-bootstrap/MenuItem'

var Header = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
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
      <div>
          <Header/>
          {this.props.children}
      </div>
    )
  }
})
