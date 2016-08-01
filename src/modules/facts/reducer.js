import CITIES from './cities.json'

const INITIAL_STATE = {
  currentSuggestion: '',
  globalFacts: CITIES,
  organizationFacts: [],
}

export function factsR(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LOAD_FACTS_BY_ORG':
      return {
        ...state,
        organizationFacts: [
          ...action.facts,
          ...state.organizationFacts.filter(e => !_.some(action.facts, f => f.variable_name === e.variable_name)),
        ],
      }
    case 'ADD_FACT_TO_ORG': {
      const oldOrganizationFact = state.organizationFacts.find(e => e.variable_name === action.organizationVariableName)
      const oldChildren = !!oldOrganizationFact ? oldOrganizationFact.children.filter(c => c.variable_name !== action.fact.variable_name) : []
      return {
        ...state,
        organizationFacts: [
          {
            variable_name: action.organizationVariableName,
            children: [
              ...oldChildren,
              action.fact,
            ],
          },
          ...state.organizationFacts.filter(e => e.variable_name !== action.organizationVariableName)
        ],
      }
    }
    case 'SUGGEST_FACT':
      return {
        ...state,
        currentSuggestion: action.suggestion,
      }
    case 'CLEAR_SUGGESTION':
      return {
        ...state,
        currentSuggestion: INITIAL_STATE.currentSuggestion,
      }
    default:
      return state
  }
}
