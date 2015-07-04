import app from 'ampersand-app'
import Router from 'ampersand-router'
import ModelPage from './pages/model'
import HomePage from './pages/home'
import React from 'react'
import Layout from './layouts/application'

export default Router.extend({
  renderPage (page, opts = {layout: true}) {
    if (opts.layout){
      page = (
        <Layout>
          {page}
        </Layout>
      )
    }
    React.render(page, document.body)
  },

  routes: {
    '': 'home',
    'model': 'model'
  },

  home () {
    this.renderPage(<HomePage/>)
  },

  model () {
    this.renderPage(<ModelPage/>)
  },
})

