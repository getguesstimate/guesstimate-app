import React, {Component} from 'react'
import {connect} from 'react-redux'

import {CreateOrganizationForm} from './form'
import {LocalAddMembers} from './members'

import './style.css'

function mapStateToProps(state) {
  return {
    newOrg: state.newOrg,
  }
}

@connect(mapStateToProps)
export class CreateOrganizationPage extends Component {
  componentWillUnmount() {
    this.props.dispatch({type: 'CLEAR_NEW_ORGANIZATION'})
  }

  render() {
    const newOrg = this.props.newOrg
    const newOrgCreated = _.has(newOrg, 'id')
    return (
      <div className='CreateOrganization'>
        <div className='row Header'>
          <div className='col-md-4'/>
          <div className='col-md-4 col-xs-12'>
            <div className='col-sm-12'>
              <div className='center-display'>
                <h1> Create an Organization </h1>
              </div>
            </div>
          </div>
        </div>
        <div className='row Steps'>
          <div className='col-xs-12'>
            <div className="ui secondary menu">
              <span className={`item ${!newOrgCreated ? 'active' : ''}`}> Create your Organization </span>
              <span className={`item ${newOrgCreated ? 'active' : ''}`}> Add Members </span>
            </div>
          </div>
        </div>
        {!newOrgCreated && <CreateOrganizationForm />}
        {!!newOrgCreated && <LocalAddMembers organizationId={newOrg.id} admin_id={newOrg.admin_id} />}
      </div>
    )
  }
}
