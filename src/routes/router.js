import React, {Component} from 'react'
import {connect, Provider} from 'react-redux'

import ReactDOM from 'react-dom'
import Router from 'ampersand-router'

import Layout from './layouts/application/index'
import Home from './home/index'
import SpaceShow from 'gComponents/spaces/show'
import SpaceIndex from 'gComponents/spaces/index/index'
import Maintenance from 'gComponents/pages/maintenance/index'
import FAQ from 'gComponents/pages/faq/index'
import TermsAndConditions from 'gComponents/pages/terms_and_conditions/index'
import PrivacyPolicy from 'gComponents/pages/privacy_policy/index'
import ComponentIndex from './component-index'
import UserShow from 'gComponents/users/show/index'
import {CreateOrganizationPageContainer} from 'gComponents/organizations/new/index'
import OrganizationNewStyleGuide from 'gComponents/organizations/new/StyleGuide'
import OrganizationShow from 'gComponents/organizations/show/index'
import FirstSubscriptionContainer from 'gComponents/subscriptions/FirstSubscription/container'
import FirstSubscriptionPage from 'gComponents/subscriptions/FirstSubscriptionPage/container'
import FirstSubscriptionStyleGuide from 'gComponents/subscriptions/FirstSubscription/StyleGuide'
import SettingsStyleGuide from 'gComponents/users/settings/StyleGuide'
import Settings from 'gComponents/users/settings/container'
import PlanIndex from 'gComponents/plans/index/container'
import PlansStyleGuide from 'gComponents/plans/index/StyleGuide'

import configureStore from './middleware'

import * as segment from '../server/segment/index'

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
    'organizations/new': 'organizationsNew',
    'organizations/:id': 'organizationShow',
    'style_guide': 'styleGuide',
    'style_guide/first_subscription': 'styleGuideFirstSubscription',
    'style_guide/settings': 'styleGuideSettings',
    'style_guide/pricing': 'styleGuidePricing',
    'style_guide/new_organization': 'styleGuideNewOrganization',
    'settings': 'settings',
    'scratchpad': 'scratchpad',
    'pricing': 'pricing',
    'subscribe/:id': 'subscribe',
  },

  spaceIndex() { this.render(<SpaceIndex/>, {backgroundColor: 'GREY'}) },
  home() { this.render(<Home/>, {isFluid: true, simpleHeader: true}) },
  spaceNew() { this.render(<SpaceNew/>) },
  spaceShow(id) { this.render(<SpaceShow spaceId={parseInt(id)}/>, {isFluid: true, showFooter: false, fullHeight: true}) },
  spaceShowEmbed(id) { this.render(<SpaceShow spaceId={id} embed={true}/>, {isFluid: true, showFooter: false, embed: true, fullHeight: true}) },
  scratchpad() { this.render(<SpaceShow spaceId={5170}/>, {isFluid: true, showFooter: false}) },
  settings() { this.render(<Settings/>) },
  styleGuide() { this.render(<ComponentIndex/>) },
  styleGuideSettings() { this.render(<SettingsStyleGuide/>, {isFluid: true, showFooter: false}) },
  styleGuideFirstSubscription() { this.render(<FirstSubscriptionStyleGuide/>) },
  styleGuidePricing() { this.render(<PlansStyleGuide/>) },
  styleGuideNewOrganization() { this.render(<OrganizationNewStyleGuide/>) },
  maintenance() { this.render(<Maintenance/>) },
  terms() { this.render(<TermsAndConditions/>) },
  privacy() { this.render(<PrivacyPolicy/>) },
  faq() { this.render(<FAQ/>) },
  subscribe(id) { this.render(<FirstSubscriptionPage planName={id}/>) },
  userShow(id) { this.render(<UserShow userId={id}/>, {backgroundColor: 'GREY'}) },
  organizationShow(id) { this.render(<OrganizationShow organizationId={id}/>, {backgroundColor: 'GREY'}) },
  organizationsNew() { this.render(<CreateOrganizationPageContainer/>, {backgroundColor: 'GREY'}) },
  pricing() { this.render(<PlanIndex/>, {backgroundColor: 'BLUE'}) },
})
