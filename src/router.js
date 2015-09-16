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
import SpaceCanvas from 'components/canvas-space/canvas-space'
import {createStore} from 'redux'
import configureStore from './stores/configureStore.js'

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

export default Router.extend({
  render (page, isFluid=false) {
    let store = configureStore()
    var fullPage = (
      <Layout isFluid={isFluid} repos={app.me.repos}>
        {page}
      </Layout>
    )
    ReactDOM.render(
      <div>
      <Provider store={store}>
        {() => <SpaceCanvas/>}
      </Provider>
        <DebugPanel left top bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>,
      document.body)
  },

  routes: {
    '': 'home',
    'repo/new': 'repoNew',
    'repo/:name': 'repoShow',
  },

  home () {
    this.render(<Home repos={app.me.repos}/>, true)
  },

  repoNew () {
    this.render(<RepoNew/>, false)
  },

  repoShow (name) {
    this.render(<RepoShow repo={name} repos={app.me.repos}/>, true)
  },
})
