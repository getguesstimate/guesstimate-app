import FACTS from './cities.json'

const INITIAL_STATE = {
  currentSuggestion: '',
  globals: FACTS,
  byOrg: [],
}

export function factBankR(state = INITIAL_STATE, {type, facts, suggestion}) {
  const by = property => e => !_.some(facts, f => f[property] === e[property])
  switch (type) {
    case 'LOAD_FACTS_BY_ORG':
      return {
        ...state,
        byOrg: [
          ...facts,
          ...state.byOrg.filter(by('organization_id')),
        ],
      }
    case 'SUGGEST_FACT':
      return {
        ...state,
        currentSuggestion: suggestion,
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
