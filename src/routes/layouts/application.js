import React, {Component, PropTypes} from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import NavHelper from './application/nav-helper'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'
import { connect } from 'react-redux';
import * as spaceActions from 'gModules/spaces/actions.js';
import * as Space from 'gEngine/space';

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
      <nav className="navbar navbar-default">
        <div className={containerClass}>
          <div className="row">
            <div className="navbar-header col-xs-8">
              <a className="navbar-brand" href="/">Guesstimate</a>
            </div>
            <div className="col-xs-4">
              <div className="repo-list pull-right">
                <NavItem spaces={this.props.spaces}/>
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


function mapStateToProps(state) {
  return {
    spaces: state.spaces
  }
}

@connect(mapStateToProps)
export default class extends Component{
  displayName: 'Layout'
  componentDidMount() {
    this.props.dispatch(spaceActions.fetch())
  }
  render () {
    console.log(this.props)
    let body = this.props.children
    if (!this.props.isFluid) {
      body = <div className="container"> {body} </div>
    }
    return (
      <NavHelper>
        <Header isFluid={this.props.isFluid} spaces={this.props.spaces}/>
        {body}
      </NavHelper>
    )
  }
}
