import app from 'ampersand-app'
import Router from 'ampersand-router'
import RepoPage from './pages/repo'
import RepoDetailPage from './pages/repo-detail'
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
    'repo': 'repo',
    'repo/:name': 'repoDetail'
  },

  home () {
    this.render(<HomePage repos={app.me.repos}/>)
  },

  repo () {
    this.render(<RepoPage/>, true)
  },

  repoDetail (name) {
    const repo = app.me.repos.getByName(name)
    this.render(<RepoDetailPage repo={repo}/>, true)
  },
})

