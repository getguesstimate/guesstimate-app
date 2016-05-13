import React, {Component, PropTypes} from 'react'
import Router from 'ampersand-router'
import { Provider } from 'react-redux';
import configureStore from './middleware'
import { connect } from 'react-redux';

import * as segment from '../server/segment/index.js'
import Layout from './layouts/application'

import Home from './home/index.js'
import SpaceShow from 'gComponents/spaces/show'
import SpaceIndex from 'gComponents/spaces/index/index.js'
import Maintenance from 'gComponents/pages/maintenance/index.js'
import FAQ from 'gComponents/pages/faq/index.js'
import TermsAndConditions from 'gComponents/pages/terms_and_conditions/index.js'
import PrivacyPolicy from 'gComponents/pages/privacy_policy/index.js'
import ComponentIndex from './component-index'
import UserShow from 'gComponents/users/show/index.js'
import OrganizationShow from 'gComponents/organizations/show/index.js'
import ReactDOM from 'react-dom'
import FirstSubscriptionContainer from 'gComponents/subscriptions/FirstSubscription/container.js'
import FirstSubscriptionPage from 'gComponents/subscriptions/FirstSubscriptionPage/container.js'
import FirstSubscriptionStyleGuide from 'gComponents/subscriptions/FirstSubscription/StyleGuide.js'
import SettingsStyleGuide from 'gComponents/users/settings/StyleGuide.js'
import Settings from 'gComponents/users/settings/container.js'
import PlanIndex from 'gComponents/plans/index/container.js'
import PlansStyleGuide from 'gComponents/plans/index/StyleGuide.js'

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
    'models/:id': 'spaceShow',
    'models/:id/embed': 'spaceShowEmbed',
    'maintenance': 'maintenance',
    'faq': 'faq',
    'terms': 'terms',
    'privacy': 'privacy',
    'users/:id': 'userShow',
    'organizations/:id': 'organizationShow',
    'style_guide': 'styleGuide',
    'style_guide/first_subscription': 'styleGuideFirstSubscription',
    'style_guide/settings': 'styleGuideSettings',
    'style_guide/pricing': 'styleGuidePricing',
    'settings': 'settings',
    'scratchpad': 'scratchpad',
    'pricing': 'pricing',
    'subscribe/:id': 'subscribe',
  },

  spaceIndex() { this.render(<SpaceIndex/>) },
  home() { this.render(<Home/>, {isFluid: true, simpleHeader: true}) },
  spaceNew() { this.render(<SpaceNew/>) },
  spaceShow(id) { this.render(<SpaceShow spaceId={id}/>, {isFluid: true, showFooter: false, fullHeight: true}) },
  spaceShowEmbed(id) { this.render(<SpaceShow spaceId={id} embed={true}/>, {isFluid: true, showFooter: false, embed: true, fullHeight: true}) },
  scratchpad() { this.render(<SpaceShow spaceId={5170}/>, {isFluid: true, showFooter: false}) },
  settings() { this.render(<Settings/>) },
  styleGuide() { this.render(<ComponentIndex/>) },
  styleGuideSettings() { this.render(<SettingsStyleGuide/>, {isFluid: true, showFooter: false}) },
  styleGuideFirstSubscription() { this.render(<FirstSubscriptionStyleGuide/>) },
  styleGuidePricing() { this.render(<PlansStyleGuide/>) },
  maintenance() { this.render(<Maintenance/>) },
  terms() { this.render(<TermsAndConditions/>) },
  privacy() { this.render(<PrivacyPolicy/>) },
  faq() { this.render(<FAQ/>) },
  subscribe(id) { this.render(<FirstSubscriptionPage planName={id}/>) },
  userShow(id) { this.render(<UserShow userId={id}/>) },
  organizationShow(id) { this.render(<OrganizationShow organizationId={id}/>) },
  pricing() { this.render(<PlanIndex/>, {backgroundColor: 'BLUE'}) },
})
