import { createSelector } from 'reselect'
import e from 'gEngine/engine'

function _sameId(idA, idB){
  return idA.toString() === idB.toString()
}

function calculatorSelector(state, {calculatorId}) { return state.calculators.find(c => _sameId(c.id, calculatorId)) }
function spaceGraphSelector(state) { return _.pick(state, ['spaces', 'metrics', 'guesstimates', 'simulations', 'users', 'me', 'organizations']) }

export const calculatorSpaceSelector = createSelector(
  spaceGraphSelector,
  calculatorSelector,
  (graph, calculator) => {
    if (!_.has(calculator, 'space_id')) { return {} }
    const {metrics, is_private} = e.space.toDSpace(calculator.space_id, graph)

    const findById = id => metrics.find(m => _sameId(m.id, id))

    const inputs = calculator.input_ids.map(findById).filter(m => !!m && e.graph.relationshipType(m.edges) === e.graph.INPUT)
    const outputs = calculator.output_ids.map(findById).filter(m => !!m && e.graph.relationshipType(m.edges) !== e.graph.INPUT)

    return {
      calculator,
      inputs,
      outputs,
      isPrivate: is_private,
    }
  }
)
