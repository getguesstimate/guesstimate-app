import generateRandomReadableId from './metric/generate_random_readable_id'

const to_variable_name = f => f.variable_name
const by_variable_name = name => f => to_variable_name(f) === name
const search = (partial, list) => _.isEmpty(partial) ? '' : [...list.filter(e => e.startsWith(partial)), ''][0]

const nounSearch = (partial, facts) => search(partial, facts.map(to_variable_name))
const propertySearch = (noun, partial, facts) => search(partial, facts.find(by_variable_name(noun)).children.map(to_variable_name))

export function toMetric(selector, takenReadableIds = [], prefix='@') {
  const id = `${prefix}${selector.join('.')}`
  return {id, readableId: generateRandomReadableId(takenReadableIds), location: {row: -1, column: -1}}
}

export function toGuesstimate(selector, {variable_name, expression}, prefix='@') {
  const metric = `${prefix}${selector.join('.')}`
  return {metric, input: expression}
}

export function toSimulation(selector, {variable_name, values}, prefix='@') {
  const metric = `${prefix}${selector.join('.')}`
  return {metric, sample: {values}}
}

export function findBySelector(facts, selector, currFact = {}) {
  if (_.isEmpty(selector)) { return currFact }
  if (_.isEmpty(facts)) { return {} }
  const fact = facts.find(by_variable_name(selector[0]))
  if (!fact) { return {} }
  return findBySelector(fact.children, selector.slice(1), fact)
}

// Currently only supports globals
export const resolveToSelector = handle => handle.slice(1).split('.')
