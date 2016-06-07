import React, {Component} from 'react'
import {connect} from 'react-redux'

import {CreateOrganizationForm} from './form'
import {LocalAddMembers} from './members'

function mapStateToProps(state) {
  return {
    newOrg: state.newOrg
  }
}

/*
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
*/

@connect(mapStateToProps)
export class CreateOrganizationPage extends Component {
  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_NEW_ORGANIZATION'})
  }

  render() {
    const newOrgCreated = _.has(this.props, 'newOrg.id')
    return (
      <div>
        {!newOrgCreated && <CreateOrganizationForm />}
        {!!newOrgCreated && <LocalAddMembers organization={this.props.newOrg} />}
      </div>
    )
  }
}
