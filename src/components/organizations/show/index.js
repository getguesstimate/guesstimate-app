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

function mapStateToProps(state) {
  return {
    me: state.me,
    organizations: state.organizations,
  }
}

const Member = ({user, isAdmin, onRemove}) => (
  <div className='member'>
    <div className='row'>
      <div className='col-xs-5'>
        <a href={e.user.url(user)}><img src={user.picture}/></a>
        <a href={e.user.url(user)} className='member--name'>{user.name}</a>
      </div>
      <div className='col-xs-2'>
        {user.sign_in_count > 0 ? 'joined' : 'invited'}
      </div>
      <div className='col-xs-2 role'>
        {isAdmin ? 'Admin' : 'Editor'}
      </div>
      <div className='col-xs-3'>
        {user.membershipId && !isAdmin &&
          <button className='ui button small remove' onClick={onRemove}>
            Remove
          </button>
        }
      </div>
    </div>
  </div>
)

@connect(mapStateToProps)
@connect(organizationSpaceSelector)
@connect(organizationMemberSelector)
@connect(httpRequestSelector)
export default class OrganizationShow extends Component{
  displayName: 'OrganizationShow'

  state = {
    attemptedFetch: false,
    openTab: 'MEMBERS',
    subMembersTab: 'ADD'
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

  destroyMembership(user) {
    this.props.dispatch(userOrganizationMembershipActions.destroy(user.membershipId))
  }

  addUser(email) {
    this.props.dispatch(userOrganizationMembershipActions.createWithEmail(this.props.organizationId, email))
  }

  render () {
    const {organizationId, organizations, members} = this.props
    const {openTab} = this.state
    const spaces =  _.orderBy(this.props.organizationSpaces.asMutable(), ['updated_at'], ['desc'])
    const organization = organizations.find(u => u.id.toString() === organizationId.toString())

    return (
      <Container>
        <div className='organizationShow'>
          <div className='GeneralSpaceIndex'>

            <div className='row'>
              <div className='col-md-4'/>
              <div className='col-md-4 col-xs-12'>
                {organization &&
                  <div className='col-sm-12'>
                    <div className='main-organization-tag'>
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

            <div className='row'>
              <div className='col-xs-12'>
                <div className="ui secondary menu">
                  { [{name: 'Members', key: 'MEMBERS'}, {name: 'Models', key: 'MODELS'}].map( e => {
                    const className = `item ${(openTab === e.key) ? 'active' : ''}`
                    return (
                      <a className={className} key={e.key} onClick={() => {this.changeTab(e.key)}}> {e.name} </a>
                    )
                   })}
                </div>
              </div>
            </div>

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
                  onRemove={this.destroyMembership.bind(this)}
                  addUser={this.addUser.bind(this)}
                  changeSubTab={(name) => {this.setState({subMembersTab: name})}}
                  httpRequests={this.props.httpRequests}
                />
              }
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

const MembersTab = ({subTab, members, admin_id, onRemove, addUser, changeSubTab, httpRequests}) => (
  <div className='row tab-members'>
    <div className='col-sm-2'>
      {subTab === 'INDEX' &&
        <div className='ui button large green' onClick={() => {changeSubTab('ADD')}}>
          Add Users
        </div>
      }
      {subTab === 'ADD' &&
        <div className='ui button large ' onClick={() => {changeSubTab('INDEX')}}>
          <Icon name='chevron-left'/> Back
        </div>
      }
    </div>
    <div className='col-sm-8'>
      {subTab === 'ADD' &&
        <div>
          <h1> Invite New Members </h1>
          <div className='ui ignored message'>
          <p> Members have viewing & editing access to all organization models. If you are on a plan, your pricing will be adjusted within 24 hours.</p>
          </div>
          <InviteUserForm addUser={addUser} httpRequests={httpRequests}/>
        </div>
      }

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
                />
                )
            })}
          </div>

        </div>
      }
    </div>
  </div>
)

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

class InviteUserForm extends Component{
  state = { value: '' }

  _submit() {
    this.props.addUser(this.state.value)
    this.setState({value: ''})
  }

  _onChange(e) {
    this.setState({value: e.target.value})
  }

  render() {
    const {value} = this.state
    const isValid = validateEmail(value)
    const isEmpty = _.isEmpty(value)
    const buttonColor = (isValid || isEmpty) ? 'green' : 'grey'

    const requests = _.orderBy(_.cloneDeep(this.props.httpRequests), ['created_at'], ['desc'])
    return(
      <div>
        <div className="ui form">
          <div className="field">
            <label>Email Address</label>
            <input value={this.state.value} type="text" placeholder="name@domain.com" ref='input' onChange={this._onChange.bind(this)}/>
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
      Invitation failed to send.
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
