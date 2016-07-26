const search = (partial, list) => _.isEmpty(partial) ? '' : [...list.filter(e => e.startsWith(partial)), ''][0]
const nounSearch = (partial, facts) => search(partial, facts.map(f => f.name))
const propertySearch = (noun, partial, facts) => search(partial, Object.keys(facts.find(f => f.name === noun)))

export function getSuggestion([noun, property]) {
  const suggestion = typeof property !== 'undefined' ? propertySearch(noun, property) : nounSearch(noun)
  return suggestion.replace(property || noun, '')
}

export function resolveProperty([noun, property]) {
  return 5//findFactByName(noun)[property]
}

export function globalsSearch([noun, property]) {
  return (dispatch, getState) => {
    const facts = getState().factBank.globals
    const suggestion = typeof property !== 'undefined' ? propertySearch(noun, property, facts) : nounSearch(noun, facts)
    dispatch({type: 'SUGGEST_FACT', suggestion: suggestion.replace(property || noun, '')})
  }
}

export function clearSuggestion() {
  return {type: 'CLEAR_SUGGESTION'}
}

export function loadByOrg(facts) {
  return {type: 'LOAD_FACTS_BY_ORG', facts}
}
