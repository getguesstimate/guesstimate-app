import React, {Component} from 'react'
import {connect} from 'react-redux'

import {MembersTab} from 'gComponents/organizations/show/members'

import {httpRequestSelector} from 'gComponents/organizations/show/httpRequestSelector'
import {organizationMemberSelector} from 'gComponents/organizations/show/organizationMemberSelector'

import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions'

@connect(organizationMemberSelector)
@connect(httpRequestSelector)
export class LocalAddMembers extends Component {
  addUser(email) {
    this.props.dispatch(userOrganizationMembershipActions.createWithEmail(this.props.organizationId, email))
  }
  render() {
    const {admin_id, members, memberships, invitations, httpRequests} = this.props
    return (
      <MembersTab
        startOnIndexTab={false}
        members={members}
        memberships={memberships}
        invitations={invitations}
        httpRequests={httpRequests}
        admin_id={admin_id}
        meIsAdmin={true}
        addUser={this.addUser.bind(this)}
      />
    )
  }
}
