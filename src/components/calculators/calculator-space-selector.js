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
    let space = graph.spaces && graph.spaces.find(s => _sameId(s.id, calculator.space_id))
    let dSpace = space && Object.assign(space.asMutable(), e.space.toDgraph(space.id, graph))

    if (dSpace) {
      dSpace.edges = e.dgraph.dependencyMap(dSpace)

      dSpace.metrics = dSpace.metrics.map(s => {
        let edges = {}
        edges.inputs = dSpace.edges.filter(i => i.output === s.id).map(e => e.input)
        edges.outputs = dSpace.edges.filter(i => i.input === s.id).map(e => e.output)
        return Object.assign({}, s, {edges})
      })
    }

    return {
      calculator,
      space: dSpace
    };
  }
);
