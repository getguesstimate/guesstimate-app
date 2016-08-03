import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ReactDOM from 'react-dom'
import Icon from 'react-fa'

import {SpaceCard, NewSpaceCard} from 'gComponents/spaces/cards'

import Container from 'gComponents/utility/container/Container'
import {MembersTab} from './members'
import {FactListContainer} from 'gComponents/facts/list/container.js'

import {httpRequestSelector} from './httpRequestSelector'
import {organizationSpaceSelector} from './organizationSpaceSelector'
import {organizationMemberSelector} from './organizationMemberSelector'

import * as modalActions from 'gModules/modal/actions'
import * as spaceActions from 'gModules/spaces/actions'
import * as organizationActions from 'gModules/organizations/actions'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions'

import e from 'gEngine/engine'

import './style.css'

const MODEL_TAB = 'models'
const MEMBERS_TAB = 'members'
const FACT_BOOK_TAB = 'facts'

const isValidTabString = tabStr => [MODEL_TAB, MEMBERS_TAB, FACT_BOOK_TAB].includes(tabStr)

function mapStateToProps(state) {
  return {
    me: state.me,
    organizations: state.organizations,
    organizationFacts: state.facts.organizationFacts,
  }
}

@connect(mapStateToProps)
@connect(organizationSpaceSelector)
@connect(organizationMemberSelector)
@connect(httpRequestSelector)
export default class OrganizationShow extends Component{
  displayName: 'OrganizationShow'

  state = {
    openTab: isValidTabString(this.props.tab) ? this.props.tab : MODEL_TAB,
  }

  componentWillMount() {
    this.refreshData()
  }

  refreshData() {
    this.props.dispatch(organizationActions.fetchById(this.props.organizationId))
    this.props.dispatch(spaceActions.fetch({organizationId: this.props.organizationId}))
  }

  changeTab(tab) {
    this.setState({
      openTab: tab,
    })
  }

  _newModel() {
    this.props.dispatch(spaceActions.create(this.props.organizationId))
  }

  destroyMembership(membershipId) {
    this.props.dispatch(userOrganizationMembershipActions.destroy(membershipId))
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
    const {organizationId, organizations, organizationFacts, members, memberships, invitations} = this.props
    const {openTab} = this.state
    const spaces =  _.orderBy(this.props.organizationSpaces.asMutable(), ['updated_at'], ['desc'])
    const organization = organizations.find(u => u.id.toString() === organizationId.toString())
    const facts = _.get(organizationFacts.find(f => f.variable_name === `organization_${organizationId}`), 'children') || []
    const meIsAdmin = !!organization && (organization.admin_id === this.props.me.id)
    const meIsMember = meIsAdmin || !!(members.find(m => m.id === this.props.me.id))

    if (!organization) { return false }
    let tabs = [{name: 'Models', key: MODEL_TAB}, {name: 'Members', key: MEMBERS_TAB}, {name: 'Fact Book', key: FACT_BOOK_TAB}]
    const portalUrl = _.get(organization, 'account._links.payment_portal.href')
    if (!!portalUrl) { tabs = [...tabs, {name: 'Billing', key: 'BILLING', href: portalUrl, onMouseUp: this.refreshData.bind(this)}] }

    return (
      <Container>
        <div className='OrganizationShow'>

          <OrganizationHeader organization={organization}/>

          {meIsMember &&
            <OrganizationTabButtons
              tabs={tabs}
              openTab={openTab}
              changeTab={this.changeTab.bind(this)}
            />
          }

          <div className='main-section'>
            {(openTab === MODEL_TAB || !meIsMember) && spaces &&
              <div className='row'>
                {meIsMember &&
                  <NewSpaceCard onClick={this._newModel.bind(this)}/>
                }
                {_.map(spaces, (s) =>
                    <SpaceCard
                      key={s.id}
                      space={s}
                      showPrivacy={true}
                    />
                )}
              </div>
            }

            {(openTab === MEMBERS_TAB) && meIsMember && members && organization &&
              <MembersTab
                organizationId={organizationId}
                startOnIndexTab={true}
                members={members}
                memberships={memberships}
                invitations={invitations}
                admin_id={organization.admin_id}
                onRemove={this.onRemove.bind(this)}
                httpRequests={this.props.httpRequests}
                meIsAdmin={meIsAdmin}
              />
            }

            {(openTab === FACT_BOOK_TAB) && meIsMember && !!facts &&
              <FactListContainer organizationId={organizationId}/>
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
      <div className='col-sm-12'>
        <div className='center-display'>
          <img src={organization.picture} />
          <h1> {organization.name} </h1>
        </div>
      </div>
    </div>
  </div>
)

const OrganizationTabButtons = ({tabs, openTab, changeTab}) => (
  <div className='row OrganizationTabButtons'>
    <div className='col-xs-12'>
      <div className="ui secondary menu">
        { tabs.map( e => {
          const className = `item ${(openTab === e.key) ? 'active' : ''}`
          if (!!e.href){
            return (
              <a
                className='item'
                key={e.key}
                href={e.href}
                target='_blank'
                onMouseUp={e.onMouseUp ? e.onMouseUp : () => {} }
              >
                {e.name}
              </a>
            )
          } else {
            return (
              <a className={className} key={e.key} onClick={() => {changeTab(e.key)}}> {e.name} </a>
            )
          }
         })}
      </div>
    </div>
  </div>
)
