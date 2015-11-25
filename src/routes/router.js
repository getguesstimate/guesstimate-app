import Router from 'ampersand-router'
import SpaceShow from 'gComponents/spaces/show'
import UserShow from 'gComponents/users/show/index.js'
import SpaceNew from './spaces/new'
import SpaceIndex from 'gComponents/spaces/index/index.js'
import ComponentIndex from './component-index'
import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './layouts/application'

import { Provider } from 'react-redux';
import configureStore from './middleware'

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

const Debug = ({store}) => (
  <DebugPanel right top bottom>
    <DevTools store={store} monitor={LogMonitor} />
  </DebugPanel>
);

const FullPage = ({isFluid, page}) => (
  <Layout isFluid={isFluid}>
    {page}
  </Layout>
);

        //{__DEV__ ? <Debug store={store}/> : ''}
export default Router.extend({
  render (page, isFluid=false) {
    let store = configureStore()
    ReactDOM.render(
      <Provider store={store}>
        <FullPage isFluid={isFluid} page={page}/>
      </Provider>,
      document.getElementById('root'))
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
