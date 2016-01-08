import '../../../../node_modules/flexboxgrid/css/flexboxgrid.min.css'
import '../../../../node_modules/react-dd-menu/dist/react-dd-menu.css';
import '../../../../semantic/dist/semantic.css'
//semantic js is dependent on jquery, which has trouble now
import '../../../styles/theme.css'

import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux';
import * as spaceActions from 'gModules/spaces/actions.js';
import * as userActions from 'gModules/users/actions.js';
import * as meActions from 'gModules/me/actions.js';
import ErrorModal from 'gComponents/application/errorModal/index.js';
import * as Space from 'gEngine/space';
import Header from '../header'
import NavHelper from './nav-helper'
import './style.css';

import * as segment from '../../../server/segment/index.js'
import * as sentry from '../../../server/sentry/index.js'

function mapStateToProps(state) {
  return {
    spaces: state.spaces,
    me: state.me,
  }
}

@connect(mapStateToProps)
export default class extends Component{
  displayName: 'Layout'

  componentDidMount() {
    this.props.dispatch(meActions.init())
    this.props.dispatch(userActions.fetch())
  }

  _registerUser(){
    if (_.has(this.props, 'me.id')) {
      const {id, profile} = this.props.me
      segment.trackUser(id, profile)
      sentry.trackUser(id, profile)
    }
  }

  render () {
    let options = Object.assign({}, {isFluid: false, simpleHeader: false}, this.props.options)

    this._registerUser()
    let body = this.props.page

    if (!options.isFluid) {
      body = <div className="container-fluid wrap"> {body} </div>
    }

    return (
      <NavHelper>
        <ErrorModal/>
        <div className='Layout'>
          <Header isFluid={options.isFluid} spaces={this.props.spaces} isBare={options.simpleHeader}/>
          {body}
        </div>
      </NavHelper>
    )
  }
}
