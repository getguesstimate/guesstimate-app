import Router from 'ampersand-router'
import SpaceShow from 'gComponents/spaces/show'
import SpaceNew from './spaces/new'
import SpaceIndex from 'gComponents/spaces/index/index.js'
import ComponentIndex from './component-index'
import React, {Component, PropTypes} from 'react'
import UserShow from 'gComponents/users/show/index.js'
import ReactDOM from 'react-dom'
import Layout from './layouts/application'

import { Provider } from 'react-redux';
import configureStore from './middleware'

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import * as segment from '../server/segment/index.js'
import * as sentry from '../server/sentry/index.js'
import { connect } from 'react-redux';

const Debug = ({store}) => (
  <DebugPanel right top bottom>
    <DevTools store={store} monitor={LogMonitor} />
  </DebugPanel>
);


function mapStateToProps(state) {
  return {
    me: state.me
  }
}

@connect(mapStateToProps)
class FullPage extends Component {

  _registerUser(){
    if (_.has(this.props, 'me.id')) {
      const {id, profile} = this.props.me
      segment.trackUser(id, profile)
      sentry.trackUser(id, profile)
    }
  }

  render() {
    this._registerUser()
    return (
      <Layout isFluid={this.props.isFluid}>
        {this.props.page}
      </Layout>
    )
  }
};

export default Router.extend({
  render (page, isFluid=false) {
    let store = configureStore()
    ReactDOM.render(
      <Provider store={store}>
        <FullPage isFluid={isFluid} page={page}/>
      </Provider>,
      document.getElementById('root')
    )
    segment.pageLoad()
  },

  routes: {
    '': 'home',
    'space/new': 'spaceNew',
    'space/:id': 'spaceShow',
    'components': 'components',
    'users/:id': 'userShow',
  },

  home () {
    this.render(<SpaceIndex/>, false)
  },

  spaceNew () {
    this.render(<SpaceNew/>, false)
  },

  spaceShow (id) {
    this.render(<SpaceShow spaceId={id}/>, true)
  },

  components () {
    this.render(<ComponentIndex/>, true)
  },

  userShow (id) {
    this.render(<UserShow userId={id}/>, false)
  },
})
