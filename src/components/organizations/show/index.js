import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import * as spaceActions from 'gModules/spaces/actions'
import * as organizationActions from 'gModules/organizations/actions'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions.js'
import { organizationSpaceSelector } from './organizationSpaceSelector.js';
import { organizationMemberSelector } from './organizationMemberSelector.js';
import { httpRequestSelector } from './httpRequestSelector.js';
import SpaceCards from 'gComponents/spaces/cards'
import Container from 'gComponents/utility/container/Container.js'
import e from 'gEngine/engine'
import './style.css'
import Icon from 'react-fa'

import * as modalActions from 'gModules/modal/actions.js'

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
    openTab: 'MEMBERS',
    subMembersTab: 'INDEX'
  }

  componentWillMount() {
    this.considerFetch(this.props)
  }

  componentDidUpdate(newProps) {
    this.considerFetch(newProps)
  }

  considerFetch(props) {
    const needsData = !(_.has(props, 'organizationSpaces') && props.organizationSpaces.length > 0)

    if (needsData) {
      this.fetchData()
    }
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
    const {organizationId, organizations, members} = this.props
    const {openTab} = this.state
    const spaces =  _.orderBy(this.props.organizationSpaces.asMutable(), ['updated_at'], ['desc'])
    const organization = organizations.find(u => u.id.toString() === organizationId.toString())
    const meIsAdmin = !!organization && (organization.admin_id === this.props.me.id)

    return (
      <Container>
        <div className='OrganizationShow'>

          <OrganizationHeader organization={organization}/>

          <OrganizationTabButtons
            tabs={[{name: 'Members', key: 'MEMBERS'}, {name: 'Models', key: 'MODELS'}]}
            openTab={openTab}
            changeTab={this.changeTab.bind(this)}
          />

          <div className='main-section'>
            {(openTab === 'MODELS') && spaces &&
              <SpaceCards
                spaces={spaces}
                showPrivacy={true}
              />
            }

            {(openTab === 'MEMBERS') && members && organization &&
              <MembersTab
                subTab={this.state.subMembersTab}
                members={members}
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

const MembersTab = ({subTab, members, admin_id, onRemove, addUser, onChangeSubTab, httpRequests, meIsAdmin}) => (
  <div className='MembersTab'>
    {subTab === 'ADD' &&
      <MembersAddSubTab {...{addUser, httpRequests, onChangeSubTab}}/>
    }
    {subTab === 'INDEX' &&
      <MembersIndexSubTab {...{subTab, members, admin_id, onRemove, onChangeSubTab, meIsAdmin}}/>
    }
  </div>
)

const MembersIndexSubTab = ({subTab, members, admin_id, onChangeSubTab, onRemove, meIsAdmin}) => (
  <div className='row MembersIndexSubTab'>
    <div className='col-sm-2'>
      {subTab === 'INDEX' && meIsAdmin &&
        <div className='ui button large green' onClick={() => {onChangeSubTab('ADD')}}>
          Add Members
        </div>
      }
    </div>
    <div className={meIsAdmin ? 'col-sm-10' : 'col-sm-8'}>
      {subTab === 'INDEX' &&
        <div>
          <div className='members'>
            {members.map(m => {
              return (
                <Member
                  key={m.id}
                  user={m}
                  isAdmin={admin_id === m.id}
                  onRemove={() => {onRemove(m)}}
                  meIsAdmin={meIsAdmin}
                />
                )
            })}
          </div>
        </div>
      }
    </div>
  </div>
)

const Member = ({user, isAdmin, onRemove, meIsAdmin}) => (
  <div className='Member'>
    {meIsAdmin &&
      <div className='row'>
        <div className='col-xs-6'>
          <a href={e.user.url(user)}><img src={user.picture}/></a>
          <a href={e.user.url(user)} className='name'>{user.name}</a>
        </div>
        <div className='col-xs-2 role'>
          {isAdmin ? 'Admin' : 'Editor'}
        </div>
        <div className='col-xs-1 invitation-status'>
          {user.sign_in_count > 0 ? 'joined' : 'invited'}
        </div>
        <div className='col-xs-3'>
          {user.membershipId && !isAdmin &&
            <button className='ui circular button small remove' onClick={onRemove}>
              <i className='ion-md-close'/>
            </button>
          }
        </div>
      </div>
    }
    {!meIsAdmin &&
      <div className='row'>
        <div className='col-xs-10'>
          <a href={e.user.url(user)}><img src={user.picture}/></a>
          <a href={e.user.url(user)} className='name'>{user.name}</a>
        </div>
      </div>
    }
  </div>
)

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

class MembersAddSubTab extends Component{
  state = { value: '' }

  componentDidMount() {
    this.refs.input.focus()
  }

  _submit() {
    this.props.addUser(this.state.value)
    this.setState({value: ''})
  }

  _onChange(e) {
    this.setState({value: e.target.value})
  }

  _onKeyDown(e) {
    if (e.keyCode === 13 && validateEmail(this.state.value)) {
      this._submit();
    }
  }

  render() {
    const {value} = this.state
    const isValid = validateEmail(value)
    const isEmpty = _.isEmpty(value)
    const buttonColor = (isValid || isEmpty) ? 'green' : 'grey'

    const requests = _.orderBy(_.cloneDeep(this.props.httpRequests), ['created_at'], ['desc'])
    return(
      <div className='row MembersAddSubTab'>
        <div className='col-sm-2'>
          <div className='ui button large ' onClick={() => {this.props.onChangeSubTab('INDEX')}}>
            <Icon name='chevron-left'/> Member List
          </div>
        </div>
        <div className='col-sm-8'>
          <h1> Invite New Members </h1>
          <p> Members have viewing & editing access to all organization models. <br/> If you are on a plan, your pricing will be adjusted within 24 hours.</p>
          <div className="ui form">
            <div className="field">
              <label>Email Address</label>
              <input
                value={this.state.value}
                onKeyDown={this._onKeyDown.bind(this)}
                type='text'
                placeholder='name@domain.com'
                ref='input'
                onChange={this._onChange.bind(this)}
              />
            </div>
            <div className={`ui button submit ${buttonColor} ${isValid ? '' : 'disabled'}`} onClick={this._submit.bind(this)}>
              Invite User
            </div>
            <div>
            </div>
          </div>
            {_.map(requests, (request) =>  {
              return(
                <InvitationHttpRequest
                  key={request.id}
                  busy={request.busy}
                  success={request.success}
                  email={request.email}
                  isExistingMember={request.isExistingMember}
                />
              )
            })}
        </div>
      </div>
    )
  }
}

const InvitationHttpRequest = ({busy, success, email, isExistingMember}) => {
  let status = httpStatus(busy, success)

  if (status === 'sending'){ return (
    <div className='InvitationHttpRequest ui ignored message'>
      Sending...
    </div>
  )} else if (status === 'failure'){ return (
    <div className='InvitationHttpRequest ui error message'>
      Invitation to {email} failed.  This could be because they are already part of the organization or because of a server problem.  If it continues, please let us know.
    </div>
  )} else if (isExistingMember){ return (
    <div className='InvitationHttpRequest ui success message'>
      {email} was added to your organization.
    </div>
  )} else { return(
    <div className='InvitationHttpRequest ui success message'>
      {email} was sent an email invitation to join your organization.
    </div>
  )}
}

function httpStatus(busy, success) {
  if (busy) { return 'sending' }
  else if (success) { return 'success' }
  else { return 'failure' }
}
