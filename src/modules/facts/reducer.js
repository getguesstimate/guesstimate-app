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
      return {
        ...state,
        organizationFacts: [
          { variable_name: action.organizationVariableName, children: [...(oldOrganizationFact.children || []), action.fact] },
          ...state.organizationFacts.filter(e => e.variable_name !== action.organizationVariableName)
        ],
      }
    }
    case 'UPDATE_FACT_WITHIN_ORG': {
      const oldOrganizationFact = state.organizationFacts.find(e => e.variable_name === action.organizationVariableName)
      if (!oldOrganizationFact) { 
        return {
          ...state,
          organizationFacts: [{variable_name: action.organizationVariableName, children: [action.fact]}, ...state.organizationFacts],
        }
      }

      const oldFactIndex = oldOrganizationFact.children.findIndex(c => c.id === action.fact.id)
      const childrenBefore = oldOrganizationFact.children.slice(0, oldFactIndex)
      const childrenAfter = oldOrganizationFact.children.slice(oldFactIndex+1)
      return {
        ...state,
        organizationFacts: [
          {
            variable_name: action.organizationVariableName,
            children: [
              ...childrenBefore,
              action.fact,
              ...childrenAfter,
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
