import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {PlanIndex} from './PlanIndex.js'

import * as modalActions from 'gModules/modal/actions.js'
import * as navigationActions from 'gModules/navigation/actions.js'

import e from 'gEngine/engine'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

@connect(mapStateToProps)
export default class PlanIndexContainer extends Component{
  displayName: 'PlanIndexContainer'

  _onChoose(planId) {
    const plan = {personal_lite: 'lite', personal_premium: 'premium'}[planId]
    navigationActions.navigate(`subscribe/${plan}`)
  }

  _onNewOrganizationNavigation() {
    navigationActions.navigate(`organizations/new`)
  }

  render () {
    const {me} = this.props
    const portalUrl = _.get(me, 'profile.account._links.payment_portal.href')
    const userPlanId = _.get(me, 'profile.plan.id')
    const isLoggedIn = e.me.isLoggedIn(me)

    const props = {
      portalUrl,
      userPlanId,
      isLoggedIn,
      onChoose: this._onChoose.bind(this),
      onNewOrganizationNavigation: this._onNewOrganizationNavigation.bind(this)
    }

    return (
      <PlanIndex {...props}/>
    )
  }
}

