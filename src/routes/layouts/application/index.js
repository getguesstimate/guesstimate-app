import '../../../../node_modules/flexboxgrid/css/flexboxgrid.min.css'
import '../../../../node_modules/react-dd-menu/dist/react-dd-menu.css';
import '../../../../node_modules/ionicons/dist/css/ionicons.css';
import '../../../../semantic/dist/semantic.css'
//semantic js is dependent on jquery, which has trouble now
import '../../../styles/theme.css'

import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import * as spaceActions from 'gModules/spaces/actions.js';
import * as userActions from 'gModules/users/actions.js';
import * as meActions from 'gModules/me/actions.js';
import ModalContainer from 'gModules/modal/routes.js';
import Main from 'gComponents/layouts/main/index.js';
import ErrorModal from 'gComponents/application/errorModal/index.js';
import * as Space from 'gEngine/space';
import Header from '../header'
import Footer from '../footer'
import NavHelper from 'gComponents/utility/NavHelper/index.js';
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
export default class Layout extends Component{
  displayName: 'Layout'

  componentWillMount() {
    this.props.dispatch(meActions.init())
  }

  _registerUser(){
    if (_.has(this.props, 'me.id')) {
      const {id, profile} = this.props.me
      if (id) {
        segment.trackUser(id, profile)
        sentry.trackUser(id, profile)
      }
    }
  }

  render () {
    let options = Object.assign({}, {
      isFluid: false,
      simpleHeader: false,
      showFooter: true,
      embed: false,
      fullHeight: false
    }, this.props.options)

    this._registerUser()
    let body = this.props.page

    return (
      <NavHelper>
        <ErrorModal/>
        <div className={`Layout ${options.fullHeight ? 'fullHeight' : ''}`}>
          <ModalContainer/>
          {!options.embed && <Header isFluid={options.isFluid} isBare={options.simpleHeader}/>}
          <Main isFluid={options.isFluid} backgroundColor={options.backgroundColor}> {body} </Main>
          {options.showFooter && <Footer/>}
        </div>
      </NavHelper>
    )
  }
}
