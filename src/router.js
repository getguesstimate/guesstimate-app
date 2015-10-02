import app from 'ampersand-app'
import Router from 'ampersand-router'
import RepoShow from './views/repos/show'
import RepoNew from './views/repos/new'
import Home from './views/home'
import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './layouts/application'

import { Provider } from 'react-redux';
import todoApp from './reducers';
import {createStore} from 'redux'
import configureStore from './stores/configureStore.js'

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

const Debug = ({store, LogMonitor}) => (
  <DebugPanel right top bottom>
    <DevTools store={store} monitor={LogMonitor} />
  </DebugPanel>
);

const FullPage = ({isFluid, page}) => (
  <Layout isFluid={isFluid} repos={app.me.repos}>
    {page}
  </Layout>
);

export default Router.extend({
  render (page, isFluid=false) {
    let store = configureStore()
    ReactDOM.render(
      <div>
        <Provider store={store}>
          <FullPage isFluid={isFluid} page={page}/>
        </Provider>
        {__DEV__ ? <Debug/> : ''}
      </div>,
      document.body)
  },

  routes: {
    '': 'home',
    'space/new': 'repoNew',
    'space/:id': 'repoShow',
  },

  home () {
    this.render(<Home repos={app.me.repos}/>, true)
  },

  repoNew () {
    this.render(<RepoNew/>, false)
  },

  repoShow (id) {
    this.render(<RepoShow spaceId={id}/>, true)
  },
})
