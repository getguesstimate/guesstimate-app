import app from 'ampersand-app'
import Router from 'ampersand-router'
import PublicPage from './pages/public'
import React from 'react'

export default Router.extend({
  routes: {
    '': 'public',
    'repos': 'repos'
  },

  public () {
    React.render(<PublicPage/>, document.body)
  },
})

