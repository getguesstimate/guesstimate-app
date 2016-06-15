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

      //<div>
        //hi there
        //<table className="ui celled structured table">

      //<thead>
        //<tr>
          //<th></th>
          //<th colSpan="2">For individuals</th>
          //<th colSpan="1">For organizations</th>
        //</tr>
        //<tr>
          //<th></th>
          //<th className="center aligned">Basic</th>
          //<th className="center aligned">Premium</th>
          //<th className="center aligned">Premium</th>
        //</tr>
      //</thead>

      //<tbody>
        //<tr>
          //<td>Private Models</td>
          //<td>20</td>
          //<td>100</td>
          //<td>Unlimitted</td>
        //</tr>
        //<tr>
          //<td>Public Models</td>
          //<td>Unlimitted</td>
          //<td>Unlimitted</td>
          //<td>Unlimitted</td>
        //</tr>
      //</tbody>

      //</table>
      //</div>
