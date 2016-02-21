import React, {Component, PropTypes} from 'react'
import Router from 'ampersand-router'
import { Provider } from 'react-redux';
import configureStore from './middleware'
import { connect } from 'react-redux';

import * as segment from '../server/segment/index.js'
import Layout from './layouts/application'

import Home from './home/index.js'
import SpaceShow from 'gComponents/spaces/show'
import SpaceNew from 'gComponents/spaces/new/index.js'
import SpaceIndex from 'gComponents/spaces/index/index.js'
import Maintenance from 'gComponents/pages/maintenance/index.js'
import FAQ from 'gComponents/pages/faq/index.js'
import TermsAndConditions from 'gComponents/pages/terms_and_conditions/index.js'
import PrivacyPolicy from 'gComponents/pages/privacy_policy/index.js'
import ComponentIndex from './component-index'
import UserShow from 'gComponents/users/show/index.js'
import ReactDOM from 'react-dom'
import Payments from './payments/index.js'

export default Router.extend({
  render (page, options={}) {

    let store = configureStore()
    ReactDOM.render(
      <Provider store={store}>
        <Layout page={page} options={options}/>
      </Provider>,
      document.getElementById('root')
    )
    segment.pageLoad()
  },

  routes: {
    '': 'home',
    'models': 'spaceIndex',
    'models/new': 'spaceNew',
    'models/:id': 'spaceShow',
    'components': 'components',
    'maintenance': 'maintenance',
    'faq': 'faq',
    'terms': 'terms',
    'privacy': 'privacy',
    'users/:id': 'userShow',
    'payments': 'payments',
  },

  spaceIndex () {
    this.render(<SpaceIndex/>)
  },

  home () {
    this.render(<Home/>, {simpleHeader: true})
  },

  spaceNew () {
    this.render(<SpaceNew/>)
  },

  spaceShow (id) {
    this.render(<SpaceShow spaceId={id}/>, {isFluid: true})
  },

  components () {
    this.render(<ComponentIndex/>)
  },

  maintenance () {
    this.render(<Maintenance/>)
  },

  terms () {
    this.render(<TermsAndConditions/>)
  },

  privacy () {
    this.render(<PrivacyPolicy/>)
  },

  faq () {
    this.render(<FAQ/>)
  },

  payments () {
    this.render(<Payments/>)
  },

  userShow (id) {
    this.render(<UserShow userId={id}/>)
  },
})
