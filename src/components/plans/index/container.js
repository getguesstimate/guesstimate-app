import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import PlanIndex from './PlanIndex.js'
import * as modalActions from 'gModules/modal/actions.js'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

@connect(mapStateToProps)
export default class PlanIndexContainer extends Component{
  displayName: 'PlanIndexContainer'

  _onChoose(planId) {
    this.props.dispatch(modalActions.openFirstSubscription(planId))
  }

  render () {
    const {me} = this.props
    const portalUrl = _.get(me, 'profile.account._links.payment_portal.href')
    const userPlanId = _.get(me, 'profile.plan.id')
    const props = {portalUrl, userPlanId, onChoose: this._onChoose.bind(this)}

    return (
      <PlanIndex {...props}/>
    )
  }
}

