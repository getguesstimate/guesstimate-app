import FACTS from './cities.json'

const findFactByName = name => FACTS.find(f => f.name === name)

export function nounSearch(partialNoun) {
  return FACTS.map(f => f.name).filter(name => name.startsWith(partialNoun))
}

export function propertySearch(noun, partialProperty) {
  return Object.keys(findFactByName(noun)).filter(property => property.startsWith(partialProperty))
}

export function resolveProperty([noun, property]) {
  return findFactByName(noun)[property]
}
