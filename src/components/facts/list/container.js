import React, {Component} from 'react'
import {connect} from 'react-redux'

import * as organizationActions from 'gModules/organizations/actions'
import {findFacts} from 'gEngine/organization'
import * as _collections from 'gEngine/collections'
import {orArr} from 'gEngine/utils'

import {FactList} from './list.js'

@connect(null)
export class FactListContainer extends Component{
  displayName: 'FactListContainer'

  render() {
    const {facts, existingVariableNames, categories, organization, categoryId, canMakeNewFacts, spaceId, imported_fact_ids} = this.props
    return (
      <FactList
        onDeleteFact={fact => this.props.dispatch(organizationActions.deleteFact(organization, fact))}
        onAddFact={fact => this.props.dispatch(organizationActions.addFact(organization, fact))}
        onEditFact={fact => this.props.dispatch(organizationActions.editFact(organization, fact, true))}
        facts={facts}
        existingVariableNames={existingVariableNames}
        categories={orArr(categories)}
        categoryId={categoryId}
        canMakeNewFacts={canMakeNewFacts}
        spaceId={spaceId}
        imported_fact_ids={imported_fact_ids}
      />
    )
  }
}
