import {selectorSearch, withSortedValues} from 'gEngine/facts'

export function getSuggestion(selector) {
  return (dispatch, getState) => {
    const {partial, suggestion} = selectorSearch(selector, [...getState().facts.globalFacts, ...getState().facts.organizationFacts])
    dispatch({type: 'SUGGEST_FACT', suggestion: suggestion.replace(partial, '')})
  }
}

export function clearSuggestion() {
  return {type: 'CLEAR_SUGGESTION'}
}

export function loadByOrg(facts) {
  return {type: 'LOAD_FACTS_BY_ORG', facts}
}

export function addToOrg(organizationVariableName, fact) {
  return {type: 'ADD_FACT_TO_ORG', organizationVariableName, fact: withSortedValues(fact)}
}

export function deleteFromOrg(organizationVariableName, {id}) {
  return {type: 'DELETE_FACT_FROM_ORG', organizationVariableName, id}
}
