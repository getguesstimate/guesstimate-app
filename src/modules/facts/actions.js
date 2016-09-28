import {editFact} from 'gModules/organizations/actions'

import {selectorSearch, withMissingStats} from 'gEngine/facts'
import * as _collections from 'gEngine/collections'
import {organizationIdFromFactReadableId} from 'gEngine/organization'
import {addStats} from 'gEngine/simulation'

export function getSuggestion(selector) {
  return (dispatch, getState) => {
    const {partial, suggestion} = selectorSearch(selector, [...getState().facts.globalFacts, ...getState().facts.organizationFacts])
    dispatch({type: 'SUGGEST_FACT', suggestion: suggestion.replace(partial, '')})
  }
}

export function clearSuggestion() {
  return {type: 'CLEAR_SUGGESTION'}
}

// TODO(matthew): Clean up this interface; right now facts is an array of org containers which are glorified arrays of
// facts.
export function loadByOrg(facts) {
  return (dispatch, getState) => {
    dispatch({type: 'LOAD_FACTS_BY_ORG', facts})
  }
}

export function addToOrg(organizationVariableName, fact) {
  return {type: 'ADD_FACT_TO_ORG', organizationVariableName, fact: withMissingStats(fact)}
}

export function updateWithinOrg(organizationVariableName, fact) {
  return {type: 'UPDATE_FACT_WITHIN_ORG', organizationVariableName, fact: withMissingStats(fact)}
}

export function deleteFromOrg(organizationVariableName, {id}) {
  return {type: 'DELETE_FACT_FROM_ORG', organizationVariableName, id}
}

export function addSimulationToFact(simulation, id) {
  return (dispatch, getState) => {
    const state = getState()

    const oldOrganizationFact = state.facts.organizationFacts.find(e => _collections.some(e.children, id))
    if (!oldOrganizationFact) {
      console.warn('Tried to add simulations to a non-existent fact!')
      return
    }

    const orgId = organizationIdFromFactReadableId(oldOrganizationFact.variable_name)
    const organization = _collections.get(state.organizations, orgId)

    const oldFact = _collections.get(oldOrganizationFact.children, id)

    addStats(simulation)
    const newFact = {
      ...oldFact,
      simulation: simulation,
    }

    dispatch(editFact(organization, newFact))
  }
}
