import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import * as spaceActions from 'gModules/spaces/actions'
import * as organizationActions from 'gModules/organizations/actions'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions.js'
import { organizationSpaceSelector } from './organizationSpaceSelector.js';
import { organizationMemberSelector } from './organizationMemberSelector.js';
import SpaceCards from 'gComponents/spaces/cards'
import Container from 'gComponents/utility/container/Container.js'
import e from 'gEngine/engine'
import './style.css'

function mapStateToProps(state) {
  return {
    me: state.me,
    organizations: state.organizations,
  }
}

const Member = ({user, isAdmin, onRemove}) => (
  <div className='member'>
    <div className='row'>
      <div className='col-xs-7'>
        <a href={e.user.url(user)}><img src={user.picture}/></a>
        <div className='member--name'>{user.name}</div>
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
export default class OrganizationShow extends Component{
  displayName: 'OrganizationShow'

  state = {
    attemptedFetch: false,
    openTab: 'MEMBERS'
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
    this.setState({openTab: tab})
  }

  destroyMembership(user) {
     this.props.dispatch(userOrganizationMembershipActions.destroy(user.membershipId))
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
                    </div>
                    <h2>
                      {organization.name}
                    </h2>
                  </div>
                }
              </div>
            </div>

            <div className="ui tabular menu">
              { [{name: 'Models', key: 'MODELS'}, {name: 'Members', key: 'MEMBERS'}].map( e => {
                const className = `item ${(openTab === e.key) ? 'active' : ''}`
                return (
                  <a className={className} onClick={() => {this.changeTab(e.key)}}> {e.name} </a>
                )
               })}
            </div>

            {(openTab === 'MODELS') && spaces &&
              <SpaceCards
                spaces={spaces}
                showPrivacy={true}
              />
            }

            {(openTab === 'MEMBERS') && members &&
              <div className='row'>
                <div className='col-sm-3'/>
                <div className='col-sm-6'>
                  <div className='members'>
                    {members.map(m => {
                      return (
                        <Member
                          key={m.id}
                          user={m}
                          isAdmin={organization.admin_id === m.id}
                          onRemove={() => {this.destroyMembership(m)}}
                        />
                        )
                    })}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </Container>
    )
  }
}
