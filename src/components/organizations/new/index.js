import React, {Component} from 'react'
import {connect} from 'react-redux'

import {CreateOrganizationForm} from './form'
import {LocalAddMembers} from './members'
import Container from 'gComponents/utility/container/Container.js'

import './style.css'

function mapStateToProps(state) {
  return {
    newOrganization: state.newOrganization,
  }
}

@connect(mapStateToProps)
export class CreateOrganizationPageContainer extends Component {
  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_NEW_ORGANIZATION'})
  }
  componentWillUnmount() {
    this.props.dispatch({type: 'CLEAR_NEW_ORGANIZATION'})
  }
  render() { return (<CreateOrganizationPage newOrganization={this.props.newOrganization}/>) }
}

export const CreateOrganizationPage = ({newOrganization}) => {
  const newOrganizationCreated = _.has(newOrganization, 'id')
  return (
    <Container>
      <div className='CreateOrganization'>
        <div className='row'>
          <div className='col-md-2'/>
          <div className='col-md-8'>

            <div className='row Header'>
              <div className='col-xs-12'>
                {!newOrganizationCreated && <h1> Step 1: Create an Organization </h1>}
                  {!!newOrganizationCreated && <h1> Step 2: Add Members </h1>}
              </div>
            </div>
            {!newOrganizationCreated && <CreateOrganizationForm />}
            {!!newOrganizationCreated && <LocalAddMembers organizationId={newOrganization.id}/>}
          </div>

        </div>
      </div>
    </Container>
  )
}

