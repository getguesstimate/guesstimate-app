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
    if (!_.has(calculator, 'space_id')) { return {} }
    const dSpace = e.space.toDSpace(calculator.space_id, graph)

    const findById = id => dSpace.metrics.find(m => _sameId(m.id, id))

    const inputs = calculator.input_ids.map(findById).filter(m => relationshipType(m.edges) === INPUT)
    const outputs = calculator.output_ids.map(findById).filter(m => relationshipType(m.edges) !== INPUT)

    return {
      calculator,
      inputs,
      outputs,
    }
  }
)
