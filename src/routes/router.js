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
import FirstSubscriptionContainer from 'gComponents/subscriptions/FirstSubscription/container.js'
import FirstSubscriptionStyleGuide from 'gComponents/subscriptions/FirstSubscription/StyleGuide.js'
import SettingsStyleGuide from 'gComponents/users/settings/StyleGuide.js'
import Settings from 'gComponents/users/settings/container.js'

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
    'maintenance': 'maintenance',
    'faq': 'faq',
    'terms': 'terms',
    'privacy': 'privacy',
    'users/:id': 'userShow',
    'payments': 'payments',
    'style_guide': 'styleGuide',
    'style_guide/first_subscription': 'styleGuideFirstSubscription',
    'style_guide/settings': 'styleGuideSettings',
    'settings': 'settings',
  },

  spaceIndex() { this.render(<SpaceIndex/>) },
  home() { this.render(<Home/>, {simpleHeader: true}) },
  spaceNew() { this.render(<SpaceNew/>) },
  spaceShow(id) { this.render(<SpaceShow spaceId={id}/>, {isFluid: true}) },
  settings() { this.render(<Settings/>) },
  styleGuide() { this.render(<ComponentIndex/>) },
  styleGuideSettings() { this.render(<SettingsStyleGuide/>, {isFluid: true}) },
  styleGuideFirstSubscription() { this.render(<FirstSubscriptionStyleGuide/>) },
  maintenance() { this.render(<Maintenance/>) },
  terms() { this.render(<TermsAndConditions/>) },
  privacy() { this.render(<PrivacyPolicy/>) },
  faq() { this.render(<FAQ/>) },
  payments() { this.render(<FirstSubscriptionContainer planId={'small'}/>) },
  userShow(id) { this.render(<UserShow userId={id}/>) },
})
