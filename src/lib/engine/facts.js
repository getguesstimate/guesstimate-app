import generateRandomReadableId from './metric/generate_random_readable_id'
import * as _guesstimate from './guesstimate'

export const HANDLE_REGEX = /@\w+\.\w+/g

const getVar = f => _.get(f, 'variable_name')
const byVariableName = name => f => getVar(f) === name
const namedLike = partial => f => getVar(f).startsWith(partial)

export function selectorSearch(selector, facts) {
  const partial = selector.pop()
  const possibleFacts = _.isEmpty(selector) ? facts : findBySelector(facts, selector).children
  if (_.isEmpty(partial) || !possibleFacts) { return {partial, suggestion: ''} }
  else { return {partial, suggestion: getVar(possibleFacts.find(namedLike(partial))) || ''} }
}

function findBySelector(facts, selector, currFact = {}) {
  if (_.isEmpty(selector)) { return currFact }
  if (_.isEmpty(facts)) { return {} }
  const fact = facts.find(byVariableName(selector[0]))
  if (!fact) { return {} }
  return findBySelector(fact.children, selector.slice(1), fact)
}

const idFrom = selector => selector.join('.')
const toMetric = (selector, takenReadableIds) => ({id: idFrom(selector), readableId: generateRandomReadableId(takenReadableIds)})
const toGuesstimate = (selector, {expression}) => ({metric: idFrom(selector), input: expression})
const toSimulation = (selector, {values}) => ({metric: idFrom(selector), sample: {values}})

const buildFullNode = (selector, fact, takenReadableIds) => ({
  metric: toMetric(selector, takenReadableIds),
  guesstimate: toGuesstimate(selector, fact),
  simulation: toSimulation(selector, fact),
})

// Currently only supports globalFacts
const resolveToSelector = handle => handle.slice(1).split('.')
export function addFactsToSpaceGraph({metrics, guesstimates, simulations}, globalFacts, organizationId) {
  // First we need to extract out the relevant fact handles, which we'll evaluate into full selectors, and the facts to
  // which they refer from the graph. We group them as they are used as a unit later.
  const handles = _.uniq(_.flatten(guesstimates.map(_guesstimate.extractFactHandles))).filter(h => !_.isEmpty(h))
  const selectors = handles.map(resolveToSelector)
  const facts = selectors.map(s => findBySelector(globalFacts, s))
  const grouped = _.zip(handles, selectors, facts).filter(([_1, _2, f]) => _.has(f, 'variable_name'))

  // When dynamically generating new metrics, we need non-colliding readableIds, so we'll store a running copy of those
  // used, and initialize some variables to account for the extra objects we'll build.
  let readableIds = metrics.map(m => m.readableId)
  let [factMetrics, factGuesstimates, factSimulations, factHandleMap] = [[], [], [], {}]
  grouped.forEach(([handle, selector, fact]) => {
    // We construct virtual metrics, guesstimates, and simulations from the selector, fact, and running readable IDs...
    const {metric, guesstimate, simulation} = buildFullNode(selector, fact, readableIds)

    // Then update all the running variables.
    factHandleMap[handle] = metric.readableId
    readableIds = [...readableIds, metric.readableId]
    factMetrics = [...factMetrics, metric]
    factGuesstimates = [...factGuesstimates, guesstimate]
    factSimulations = [...factSimulations, simulation]
  })

  return {
    metrics: [...metrics, ...factMetrics],
    guesstimates: [...guesstimates.map(_guesstimate.translateFactHandleFn(factHandleMap)), ...factGuesstimates],
    simulations: [...simulations, ...factSimulations],
  }
}
