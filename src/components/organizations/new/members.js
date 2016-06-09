import React, {Component} from 'react'
import {connect} from 'react-redux'


import {httpRequestSelector} from 'gComponents/organizations/show/httpRequestSelector'
import {organizationMemberSelector} from 'gComponents/organizations/show/organizationMemberSelector'
import Card, {CardListElement} from 'gComponents/utility/card/index'
import {MemberAddForm} from '../shared/MemberAddForm/index'

import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions'

export class LocalAddMembers extends Component {
  render() {
    const {organizationId} = this.props
    return (
      <div className='row'>
        <div className='col-sm-7'>
          <MemberAddForm organizationId={organizationId}/>
          <br/>
          <br/>
          <div className='ui button green'>Finish Registration </div>
        </div>
        <div className='col-sm-1'/>
        <div className='col-sm-4'>
          <div className='ui message'>
            <h3> Organization Members </h3>
            <p>Organization members will be able to see and edit all organization models.</p>
            <p>As an organization admin, you will be able to invite, add, and remove members in the future.</p>
          </div>
        </div>
      </div>
    )
  }
}
