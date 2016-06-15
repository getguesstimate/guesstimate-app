import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import PlanIndex from './PlanIndex.js'
import * as modalActions from 'gModules/modal/actions.js'
import * as navigationActions from 'gModules/navigation/actions.js'

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
    const props = {
      portalUrl,
      userPlanId,
      onChoose: this._onChoose.bind(this),
      onNewOrganizationNavigation: this._onNewOrganizationNavigation.bind(this)
    }

    return (
      <PlanIndex {...props}/>
    )
  }
}

