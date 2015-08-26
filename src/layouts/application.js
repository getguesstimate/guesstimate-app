import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import SplitButton from 'react-bootstrap/SplitButton' 
import MenuItem from 'react-bootstrap/MenuItem'
import NavHelper from '../components/nav-helper'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'

const NavItem = React.createClass({
  render () {
    return (
      <SplitButton title='Repo List' pullRight id='split-button-pull-right'>
       {this.props.repos.models.map((repo) => {
            return (
              <MenuItem href={repo.appUrl} title={repo.description}>{repo.name}</MenuItem>
            )
        })}
      </SplitButton>
    )
  }
})

const Header = React.createClass({
  mixins: [ampersandMixin],
  displayName: 'Header',  
  render () { 
    let containerClass = (this.props.isFluid === true) ? "container-fluid" : "container";
    return (
      <nav className="navbar navbar-default">
        <div className={containerClass}>
          <div className="row">
            <div className="navbar-header col-xs-8">
              <a className="navbar-brand" href="/">Guesstimate.io</a>
            </div>
            <div className="col-xs-4">
              <div className="repo-list pull-right">
                <NavItem repos={this.props.repos}/>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li><a href="/repo/new"><Icon name='plus'/></a></li>
              </ul>
            </div>
          </div>
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
        <Header isFluid={this.props.isFluid} repos={this.props.repos}/>
        {body}
      </NavHelper>
    )
  }
})
