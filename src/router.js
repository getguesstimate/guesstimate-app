import app from 'ampersand-app'
import Router from 'ampersand-router'
import RepoShow from './views/repos/show'
import RepoNew from './views/repos/new'
import Home from './views/home'
import React from 'react'
import Layout from './layouts/application'

export default Router.extend({
  render (page, isFluid=false) {
    var fullPage = (
      <Layout isFluid={isFluid} repos={app.me.repos}>
        {page}
      </Layout>
    )
    React.render(fullPage, document.body)
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
