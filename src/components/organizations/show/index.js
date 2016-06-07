import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ReactDOM from 'react-dom'
import Icon from 'react-fa'

import SpaceCards from 'gComponents/spaces/cards'
import SpaceList from 'gComponents/spaces/list'
import Container from 'gComponents/utility/container/Container'
import {MembersTab} from './members'

import {httpRequestSelector} from './httpRequestSelector'
import {organizationSpaceSelector} from './organizationSpaceSelector'
import {organizationMemberSelector} from './organizationMemberSelector'

import * as modalActions from 'gModules/modal/actions'
import * as spaceActions from 'gModules/spaces/actions'
import * as organizationActions from 'gModules/organizations/actions'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions'

import e from 'gEngine/engine'

import './style.css'

function mapStateToProps(state) {
  return {
    me: state.me,
    organizations: state.organizations,
  }
}

@connect(mapStateToProps)
@connect(organizationSpaceSelector)
@connect(organizationMemberSelector)
@connect(httpRequestSelector)
export default class OrganizationShow extends Component{
  displayName: 'OrganizationShow'

  state = {
    attemptedFetch: false,
    openTab: 'MODELS',
    subMembersTab: 'INDEX'
  }

  componentWillMount() {
    this.fetchData()
  }

  componentDidUpdate() {
    this.fetchData()
  }

  fetchData() {
    if (!this.state.attemptedFetch) {
      this.props.dispatch(organizationActions.fetchById(this.props.organizationId))
      this.props.dispatch(spaceActions.fetch({organizationId: this.props.organizationId}))
      this.setState({attemptedFetch: true})
    }
  }

  changeTab(tab) {
    this.setState({
      openTab: tab,
      subMembersTab: 'INDEX'
    })
  }

  destroyMembership(membershipId) {
    this.props.dispatch(userOrganizationMembershipActions.destroy(membershipId))
  }

  addUser(email) {
    this.props.dispatch(userOrganizationMembershipActions.createWithEmail(this.props.organizationId, email))
  }

  onRemove(member) {
    this.confirmRemove(member)
  }

  confirmRemove({email, name, membershipId}) {
    const removeCallback = () => {
      this.destroyMembership(membershipId)
      this.props.dispatch(modalActions.close())
    }

    const message = `Are you sure you want to remove ${name} from this organization?`

    this.props.dispatch(modalActions.openConfirmation({onConfirm: removeCallback, message}))
  }


  render () {
    const {organizationId, organizations, members, memberships, invitations} = this.props
    const unjoinedInvitees = invitations.filter(i => !_.some(memberships, m => m.invitation_id === i.id))
    const {openTab} = this.state
    const spaces =  _.orderBy(this.props.organizationSpaces.asMutable(), ['updated_at'], ['desc'])
    const organization = organizations.find(u => u.id.toString() === organizationId.toString())
    const meIsAdmin = !!organization && (organization.admin_id === this.props.me.id)
    const meIsMember = meIsAdmin || !!(members.find(m => m.id === this.props.me.id))

    return (
      <Container>
        <div className='OrganizationShow'>

          <OrganizationHeader organization={organization}/>

          {meIsMember &&
            <OrganizationTabButtons
              tabs={[{name: 'Models', key: 'MODELS'}, {name: 'Members', key: 'MEMBERS'}]}
              openTab={openTab}
              changeTab={this.changeTab.bind(this)}
            />
          }

          <div className='main-section'>
            {(openTab === 'MODELS' || !meIsMember) && spaces &&
              <SpaceCards
                spaces={spaces}
                showPrivacy={true}
              />
            }

            {(openTab === 'MEMBERS') && meIsMember && members && organization &&
              <MembersTab
                subTab={this.state.subMembersTab}
                members={members}
                invitations={unjoinedInvitees}
                admin_id={organization.admin_id}
                onRemove={this.onRemove.bind(this)}
                addUser={this.addUser.bind(this)}
                onChangeSubTab={(name) => {this.setState({subMembersTab: name})}}
                httpRequests={this.props.httpRequests}
                meIsAdmin={meIsAdmin}
              />
            }
          </div>
        </div>
      </Container>
    )
  }
}

const OrganizationHeader = ({organization}) => (
  <div className='row OrganizationHeader'>
    <div className='col-md-4'/>
    <div className='col-md-4 col-xs-12'>
      {organization &&
        <div className='col-sm-12'>
          <div className='center-display'>
            <img
              src={organization.picture}
            />
            <h1>
              {organization.name}
            </h1>
          </div>
        </div>
      }
    </div>
  </div>
)

const OrganizationTabButtons = ({tabs, openTab, changeTab}) => (
  <div className='row OrganizationTabButtons'>
    <div className='col-xs-12'>
      <div className="ui secondary menu">
        { tabs.map( e => {
          const className = `item ${(openTab === e.key) ? 'active' : ''}`
          return (
            <a className={className} key={e.key} onClick={() => {changeTab(e.key)}}> {e.name} </a>
          )
         })}
      </div>
    </div>
  </div>
)
