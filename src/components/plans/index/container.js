import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import PlanIndex from './PlanIndex.js'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

@connect(mapStateToProps)
export default class PlanIndexContainer extends Component{
  displayName: 'PlanIndexContainer'

  render () {
    const {me} = this.props
    const portalUrl = _.get(me, 'profile.account._links.payment_portal.href')
    const userPlanId = _.get(me, 'profile.plan.id')
    const props = {portalUrl, userPlanId}

    return (
      <PlanIndex {...props}/>
    )
  }
}

