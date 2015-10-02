import React, {Component, PropTypes} from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import NavHelper from '../components/nav-helper'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'
import { connect } from 'react-redux';
import * as spaceActions from '../actions/space-actions.js';

const NavItem = React.createClass({
  render () {
    return (
    <ButtonGroup>
        <DropdownButton title='Example Guesstimates' id='split-button-pull-right'>
         {this.props.repos.models.map((repo) => {
              return (
                <MenuItem href={repo.appUrl} kety={repo.appUrl} title={repo.description}>{repo.name}</MenuItem>
              )
          })}
        </DropdownButton>
        <Button href="/repo/new"><Icon name='plus'/></Button>
      </ButtonGroup>
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
              <a className="navbar-brand" href="/">Guesstimate</a>
            </div>
            <div className="col-xs-4">
              <div className="repo-list pull-right">
                <NavItem repos={this.props.repos}/>
              </div>
              <ul className="nav navbar-nav pull-right">
              </ul>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </nav>
    );
  }
});

@connect()
export default class extends Component{
  displayName: 'Layout'
  componentDidMount() {
    this.props.dispatch(spaceActions.fetch())
  }
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
}
