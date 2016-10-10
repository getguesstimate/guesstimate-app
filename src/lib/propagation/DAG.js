import {SimulationNode} from './node'
import {withInfiniteLoopErrorFn, withMissingInputErrorFn, withAncestralErrorFn} from './errors'

import {getSubMatches, indicesOf} from 'gEngine/utils'
import {get, orFns} from 'gEngine/collections'

import {idMatchesSome, getMissingInputs, getAncestors, getCycleSets, toCyclePseudoNode, separateIntoHeightSets} from 'lib/DAG/DAG'

const ID_REGEX = /\$\{([^\}]*)\}/g
const isDescendedFromFn = (idSet, ancestors) => n => _.some(idSet, id => ancestors[n.id].includes(id))
const withInputIndicesFn = nodeSet => n => ({...n, inputIndices: indicesOf(nodeSet, ({id}) => n.inputs.includes(id))})

function expandCyclesAndAddGraphErrors(component, ancestors) {
  const missingInputs = getMissingInputs(_.flatten(component))

  const withCyclesExpanded = component.map(heightSet => _.flatten(heightSet.map(n => n.isCycle ? n.nodes.map(withInfiniteLoopErrorFn(n.nodes)) : n)))
  const withMissingInputErrors = withCyclesExpanded.map(heightSet => heightSet.map(withMissingInputErrorFn(missingInputs)))

  return withMissingInputErrors.map(heightSet => {
    return heightSet.map(withAncestralErrorFn(_.flatten(withMissingInputErrors), ancestors))
  })
}

export class SimulationDAG {
  constructor(nodes) {
    if (!!_.get(window, 'recorder')) { window.recorder.recordSimulationDAGConstructionStart(this) }

    const containsDuplicates = _.some(nodes, (n, i) => idMatchesSome(nodes.slice(i+1))(n))
    if (containsDuplicates) { console.warn('DUPLICATE IDs DETECTED'); return }

    const withInputs = nodes.map(n => ({...n, inputs: _.uniq(getSubMatches(n.expression, ID_REGEX, 1))}))

    this.ancestors = getAncestors(withInputs)
    const {acyclicNodes, cycleSets} = getCycleSets(withInputs, this.ancestors)
    const cyclePseudoNodes = cycleSets.map(toCyclePseudoNode)
    const heightSets =  separateIntoHeightSets([...acyclicNodes, ...cyclePseudoNodes])
    const processedHeightSets = _.flatten(expandCyclesAndAddGraphErrors(heightSets, this.ancestors))
    const foo = withInputIndicesFn(processedHeightSets)
    const withInputIndices = processedHeightSets.map(withInputIndicesFn(processedHeightSets))
    this.nodes = withInputIndices.map((n, i) => new SimulationNode(n, this, i))

    if (!!_.get(window, 'recorder')) { window.recorder.recordSimulationDAGConstructionStop(this) }
  }

  find(id) { return get(this.nodes, id) }
  subsetFrom(idSet) { return this.nodes.filter(orFns(n => idSet.includes(n.id), isDescendedFromFn(idSet, this.ancestors))) }
  strictSubsetFrom(idSet) { return this.nodes.filter(isDescendedFromFn(idSet, this.ancestors)) }
}
