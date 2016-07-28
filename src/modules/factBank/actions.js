const resolveVariableName = (prefix, parents, variable_name) => `${prefix}${[...parents, variable_name].join('.')}`

const to_variable_name = f => f.variable_name
const by_variable_name = name => f => to_variable_name(f) === name
const search = (partial, list) => _.isEmpty(partial) ? '' : [...list.filter(e => e.startsWith(partial)), ''][0]

const nounSearch = (partial, facts) => search(partial, facts.map(to_variable_name))
const propertySearch = (noun, partial, facts) => search(partial, facts.find(by_variable_name(noun)).children.map(to_variable_name))

export function getSuggestion([noun, property]) {
  const suggestion = typeof property !== 'undefined' ? propertySearch(noun, property) : nounSearch(noun)
  return suggestion.replace(property || noun, '')
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
