import generateRandomReadableId from './metric/generate_random_readable_id'
import * as _guesstimate from './guesstimate'

const byVariableName = name => f => f.variable_name === name
const namedLike = partial => f => f.variable_name.startsWith(partial)
const search = (partial, list) => _.isEmpty(partial) || !list ? '' : (_.get(list.filter(namedLike(partial))[0], 'variable_name') || '')

const findChildrenBySelector = (facts, selector) => _.isEmpty(selector) ? facts : findBySelector(facts, selector).children
export function selectorSearch(selector, facts) {
  const partial = selector.pop()
  const suggestion = search(partial, findChildrenBySelector(facts, selector))
  return {partial, suggestion}
}

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
  const fact = facts.find(byVariableName(selector[0]))
  if (!fact) { return {} }
  return findBySelector(fact.children, selector.slice(1), fact)
}

// Currently only supports globals
const resolveToSelector = handle => handle.slice(1).split('.')
export function addFactsToSpaceGraph({metrics, guesstimates, simulations}, globals, organizationId) {
  const handles = _.uniq(_.flatten(guesstimates.map(_guesstimate.extractFactHandles))).filter(h => !_.isEmpty(h))
  const selectors = handles.map(resolveToSelector)
  const facts = selectors.map(s => findBySelector(globals, s))
  const grouped = _.zip(handles, selectors, facts).filter(([_1, _2, f]) => _.has(f, 'variable_name'))

  let readableIds = metrics.map(m => m.readableId)
  let [factMetrics, factGuesstimates, factSimulations, factHandleMap] = [[], [], [], {}]
  grouped.forEach(([handle, selector, fact]) => {
    const metric = toMetric(selector, readableIds)

    factHandleMap[handle] = metric.readableId
    readableIds = [...readableIds, metric.readableId]
    factMetrics = [...factMetrics, metric]
    factGuesstimates = [...factGuesstimates, toGuesstimate(selector, fact)]
    factSimulations = [...factSimulations, toSimulation(selector, fact)]
  })

  return {
    metrics: [...metrics, ...factMetrics],
    guesstimates: [...guesstimates.map(_guesstimate.translateFactHandleFn(factHandleMap)), ...factGuesstimates],
    simulations: [...simulations, ...factSimulations],
  }
}
