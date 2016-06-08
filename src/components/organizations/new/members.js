import React, {Component} from 'react'
import {connect} from 'react-redux'


import {httpRequestSelector} from 'gComponents/organizations/show/httpRequestSelector'
import {organizationMemberSelector} from 'gComponents/organizations/show/organizationMemberSelector'
import Card, {CardListElement} from 'gComponents/utility/card/index'
import {MemberAddForm} from '../shared/MemberAddForm/index'

import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions'

export class LocalAddMembers extends Component {
  render() {
    const {admin_id, members, memberships, invitations, httpRequests} = this.props
    return (
      <div>
        <MemberAddForm organizationId={this.props.organizationId}/>
      </div>
    )
  }
}
