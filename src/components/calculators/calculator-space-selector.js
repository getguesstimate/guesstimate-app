import { createSelector } from 'reselect'
import e from 'gEngine/engine'

function _sameId(idA, idB){
  return idA.toString() === idB.toString()
}

const INTERMEDIATE = 'INTERMEDIATE'
const OUTPUT = 'OUTPUT'
const INPUT = 'INPUT'
const NOEDGE = 'NOEDGE'

const relationshipType = (edges) => {
  if (edges.inputs.length && edges.outputs.length) { return INTERMEDIATE }
  if (edges.inputs.length) { return OUTPUT }
  if (edges.outputs.length) { return INPUT }
  return NOEDGE
}

function calculatorSelector(state, {calculatorId}) { return state.calculators.find(c => _sameId(c.id, calculatorId)) }
function spaceGraphSelector(state) { return _.pick(state, ['spaces', 'metrics', 'guesstimates', 'simulations', 'users', 'me', 'organizations']) }

export const calculatorSpaceSelector = createSelector(
  spaceGraphSelector,
  calculatorSelector,
  (graph, calculator) => {
    let space = graph.spaces && graph.spaces.find(s => _sameId(s.id, calculator.space_id))
    if (!space) { return {} }

    let dSpace = Object.assign(space.asMutable(), e.space.toDgraph(space.id, graph))

    dSpace.edges = e.dgraph.dependencyMap(dSpace)

    dSpace.metrics = dSpace.metrics.map(s => {
      let edges = {}
      edges.inputs = dSpace.edges.filter(i => i.output === s.id).map(e => e.input)
      edges.outputs = dSpace.edges.filter(i => i.input === s.id).map(e => e.output)
      return Object.assign({}, s, {edges})
    })

    const findById = id => dSpace.metrics.find(m => _sameId(m.id, id))

    const inputs = calculator.input_ids.map(findById).filter(m => relationshipType(m.edges) === INPUT)
    const outputs = calculator.output_ids.map(findById).filter(m => relationshipType(m.edges) === OUTPUT)

    return {
      calculator,
      inputs,
      outputs,
    }
  }
)
