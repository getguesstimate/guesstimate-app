import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import * as spaceActions from 'gModules/spaces/actions'
import * as organizationActions from 'gModules/organizations/actions'
import { organizationSpaceSelector } from './organizationSpaceSelector.js';
import { organizationMemberSelector } from './organizationMemberSelector.js';
import Container from 'gComponents/utility/container/Container.js'
import e from 'gEngine/engine'
import './style.css'

function mapStateToProps(state) {
  return {
    me: state.me,
    organizations: state.organizations,
  }
}

const Member = ({user}) => (
  <div className='member'>
    <a href={e.user.url(user)}><img src={user.picture}/></a>
  </div>
)

@connect(mapStateToProps)
@connect(organizationSpaceSelector)
@connect(organizationMemberSelector)
export default class OrganizationShow extends Component{
  displayName: 'OrganizationShow'

  state = {
    attemptedFetch: false
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

  render () {
    const {organizationId, organizations, members} = this.props
    const spaces =  _.orderBy(this.props.organizationSpaces.asMutable(), ['updated_at'], ['desc'])
    const organization = organizations.find(u => u.id.toString() === organizationId.toString())

    return (
      <Container>
        <div className='organizationShow'>
          <div className='GeneralSpaceIndex row'>
            <div className='col-sm-3'>
              <div className='row'>
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
                    <div className='members'>
                      {members && members.map(m => {
                        console.log('member', m)
                        return (<Member key={m.id} user={m}/>)
                      })}
                    </div>
                  </div>
                }
              </div>
            </div>

            <div className='col-sm-9'>
              {spaces &&
                <SpaceList spaces={spaces} showUsers={true} hasMorePages={false}/>
              }
            </div>
          </div>
        </div>
      </Container>
    )
  }
}
