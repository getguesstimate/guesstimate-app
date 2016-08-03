import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import * as organizationActions from 'gModules/organizations/actions'

import {FactList} from './list.js'

function mapStateToProps(state) {
  return {
    organizations: state.organizations,
    organizationFacts: state.facts.organizationFacts,
  }
}

@connect(mapStateToProps)
export class FactListContainer extends Component{
  displayName: 'FactListContainer'

  render() {
    const {organizationId, organizations, organizationFacts} = this.props
    const facts = _.get(organizationFacts.find(f => f.variable_name === `organization_${organizationId}`), 'children') || []
    const organization = organizations.find(u => u.id.toString() === organizationId.toString())
    return (
      <FactList
        onDeleteFact={fact => this.props.dispatch(organizationActions.deleteFact(organization, fact))}
        onAddFact={fact => this.props.dispatch(organizationActions.addFact(organization, fact))}
        onEditFact={fact => this.props.dispatch(organizationActions.editFact(organization, fact))}
        facts={facts}
      />
    )
  }
}
