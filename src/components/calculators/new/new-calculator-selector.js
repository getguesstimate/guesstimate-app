import { createSelector } from 'reselect'
import e from 'gEngine/engine'

// TODO(matthew): DRY this code up.
function _sameId(idA, idB){
  return idA.toString() === idB.toString()
}

const INTERMEDIATE = 'INTERMEDIATE'
const OUTPUT = 'OUTPUT'
const INPUT = 'INPUT'
const NOEDGE = 'NOEDGE'

const spaceIdSelector = (_, {space_id}) => space_id
const spaceGraphSelector = state => _.pick(state, ['spaces', 'metrics', 'guesstimates', 'simulations', 'users', 'me', 'organizations'])

export const newCalculatorSelector = createSelector(
  spaceIdSelector,
  spaceGraphSelector,
  (space_id, graph) => {
    let space = graph.spaces && graph.spaces.find(s => _sameId(s.id, space_id))
    if (!space) { return {} }

    let dSpace = Object.assign(space.asMutable(), e.space.toDgraph(space.id, graph))

    dSpace.edges = e.dgraph.dependencyMap(dSpace)

    dSpace.metrics = dSpace.metrics.map(s => {
      let edges = {}
      edges.inputs = dSpace.edges.filter(i => i.output === s.id).map(e => e.input)
      edges.outputs = dSpace.edges.filter(i => i.input === s.id).map(e => e.output)
      return Object.assign({}, s, {edges})
    })

    return {
      spaceId: dSpace.id,
      space: dSpace
    }
  }
)
