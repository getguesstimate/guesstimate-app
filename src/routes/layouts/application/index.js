import '../../../../node_modules/flexboxgrid/css/flexboxgrid.min.css'
import '../../../../semantic/dist/semantic.css'
//semantic js is dependent on jquery, which has trouble now
import '../../../styles/theme.css'

import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import * as spaceActions from 'gModules/spaces/actions.js';
import * as userActions from 'gModules/users/actions.js';
import * as meActions from 'gModules/me/actions.js';
import * as Space from 'gEngine/space';
import Header from '../header'
import NavHelper from './nav-helper'
import './style.css';
import '../../../../node_modules/react-dd-menu/dist/react-dd-menu.css';

function mapStateToProps(state) {
  return {
    spaces: state.spaces
  }
}

@connect(mapStateToProps)
export default class extends Component{
  displayName: 'Layout'
  componentDidMount() {
    this.props.dispatch(meActions.init())
    this.props.dispatch(spaceActions.fetch())
    this.props.dispatch(userActions.fetch())
  }
  render () {
    let body = this.props.children
    if (!this.props.isFluid) {
      body = <div className="ui container"> {body} </div>
    }
    return (
      <NavHelper>
        <Header isFluid={this.props.isFluid} spaces={this.props.spaces}/>
        {body}
      </NavHelper>
    )
  }
}
