import app from 'ampersand-app'
import Router from 'ampersand-router'
import ModelPage from './pages/model'
import HomePage from './pages/home'
import React from 'react'

export default Router.extend({
  routes: {
    '': 'home',
    'model': 'model'
  },

  home () {
    React.render(<HomePage/>, document.body)
  },

  model () {
    React.render(<ModelPage/>, document.body)
  },
})

