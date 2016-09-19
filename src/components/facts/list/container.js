import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import * as organizationActions from 'gModules/organizations/actions'
import {findFacts} from 'gEngine/organization'
import * as _collections from 'gEngine/collections'

import {FactList} from './list.js'

@connect(null)
export class FactListContainer extends Component{
  displayName: 'FactListContainer'

  render() {
    const {facts, existingVariableNames, organization, categoryId, isEditable, spaceId, imported_fact_ids} = this.props
    return (
      <FactList
        onDeleteFact={fact => this.props.dispatch(organizationActions.deleteFact(organization, fact))}
        onAddFact={fact => this.props.dispatch(organizationActions.addFact(organization, fact, categoryId))}
        onEditFact={fact => this.props.dispatch(organizationActions.editFact(organization, fact, true))}
        facts={facts}
        existingVariableNames={existingVariableNames}
        isEditable={isEditable}
        spaceId={spaceId}
        imported_fact_ids={imported_fact_ids}
      />
    )
  }
}
