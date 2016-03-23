import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import * as spaceActions from 'gModules/spaces/actions'
import * as organizationActions from 'gModules/organizations/actions'
import './style.css'
import { organizationSpaceSelector } from './organizationSpaceSelector.js';
import Container from 'gComponents/utility/container/Container.js'

function mapStateToProps(state) {
  return {
    me: state.me,
    organizations: state.organizations,
  }
}

@connect(mapStateToProps)
@connect(organizationSpaceSelector)
export default class OrganizationShow extends Component{
  displayName: 'OrganizationShow'

  componentWillMount(){
    this.props.dispatch(organizationActions.fetchById(this.props.organizationId))
    this.props.dispatch(spaceActions.fetch({organizationId: this.props.organizationId}))
  }

  render () {
    const {organizationId, organizations} = this.props
    const spaces =  _.orderBy(this.props.organizationSpaces.asMutable(), ['updated_at'], ['desc'])

    let organization = null

    if (organizations && organizations.length) {
      organization = organizations.find(u => u.id.toString() === organizationId.toString())
    }

    return (
      <Container>
        <div className='userShow'>
          <div className='GeneralSpaceIndex row'>
            <div className='col-sm-3'>
              <div className='row'>

                <div className='col-sm-12'>
                    {organization &&
                      <h2>
                        {organization.name}
                      </h2>
                    }
                </div>
              </div>
            </div>

            <div className='col-sm-9'>
              {spaces &&
                <SpaceList spaces={spaces} showUsers={true} showOrganizations={false} hasMorePages={false}/>
              }
            </div>
          </div>
        </div>
      </Container>
    )
  }
}
