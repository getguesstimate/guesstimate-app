import FACTS from './cities.json'

const findFactByName = name => FACTS.find(f => f.name === name)

const search = (partial, list) => _.isEmpty(partial) ? '' : [...list.filter(e => e.startsWith(partial)), ''][0]
const nounSearch = partial => search(partial, FACTS.map(f => f.name))
const propertySearch = (noun, partial) => search(partial, Object.keys(findFactByName(noun)))

export function getSuggestion([noun, property]) {
  const suggestion = typeof property !== 'undefined' ? propertySearch(noun, property) : nounSearch(noun)
  return suggestion.replace(property || noun, '')
}

export function resolveProperty([noun, property]) {
  return findFactByName(noun)[property]
}
