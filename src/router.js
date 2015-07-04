import app from 'ampersand-app'
import Router from 'ampersand-router'
import ModelPage from './pages/model'
import HomePage from './pages/home'
import React from 'react'
import Layout from './layouts/application'

export default Router.extend({
  render (page, isFluid=false) {
    var fullPage = (
      <Layout isFluid={isFluid}>
        {page}
      </Layout>
    )
    React.render(fullPage, document.body)
  },

  routes: {
    '': 'home',
    'model': 'model'
  },

  home () {
    this.render(<HomePage/>)
  },

  model () {
    this.render(<ModelPage/>, true)
  },
})

