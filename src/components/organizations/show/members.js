import React, {Component, PropTypes} from 'react'

import Icon from 'react-fa'

import e from 'gEngine/engine'

import './members.css'

export const MembersTab = ({subTab, members, invitations, admin_id, onRemove, addUser, onChangeSubTab, httpRequests, meIsAdmin}) => (
  <div className='MembersTab'>
    {subTab === 'ADD' &&
      <MembersAddSubTab {...{addUser, httpRequests, onChangeSubTab}}/>
    }
    {subTab === 'INDEX' &&
      <MembersIndexSubTab {...{subTab, members, invitations, admin_id, onRemove, onChangeSubTab, meIsAdmin}}/>
    }
  </div>
)

const MembersIndexSubTab = ({subTab, members, invitations, admin_id, onChangeSubTab, onRemove, meIsAdmin}) => (
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
            {meIsAdmin && invitations.map(i => {
              return (
                <Invitee
                  key={i.id}
                  email={i.email}
                />
              )
            })}
          </div>
        </div>
      }
    </div>
  </div>
)

const Invitee = ({email}) => (
  <div className='Member'>
    <div className='row'>
      <div className='col-xs-7'>
        <div className='avatar'><Icon name='envelope'/></div>
        <div className='name'>{email}</div>
      </div>
      <div className='col-xs-2 role'></div>
      <div className='col-xs-2 invitation-status'>invited</div>
      <div className='col-xs-1'></div>
    </div>
  </div>
)

const Member = ({user, isAdmin, onRemove, meIsAdmin}) => (
  <div className='Member'>
    {meIsAdmin &&
      <div className='row'>
        <div className='col-xs-7'>
          <a href={e.user.url(user)}><img className='avatar' src={user.picture}/></a>
          <a href={e.user.url(user)} className='name'>{user.name}</a>
        </div>
        <div className='col-xs-2 role'>
          {isAdmin ? 'Admin' : 'Editor'}
        </div>
        <div className='col-xs-2 invitation-status'>joined</div>
        <div className='col-xs-1'>
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
          <a href={e.user.url(user)}><img className='avatar' src={user.picture}/></a>
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

export class MembersAddSubTab extends Component{
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
