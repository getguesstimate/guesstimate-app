import {expect} from 'chai'

import {toDAG} from '../graph'
import * as constants from '../constants'

import * as _collections from 'gEngine/collections'

// ERRORS:
const {
  NODE_TYPES,
  ERROR_TYPES: {GRAPH_ERROR},
  ERROR_SUBTYPES: {GRAPH_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR}},
} = constants

const toExprId = id => `\$\{${toNodeId(id)}\}`
const toNodeId = idNum => `node:${idNum}`
const toExpr = inputs => `=${inputs.map(toExprId).join(' + ')}`
const makeNode = (idNum, inputNums=[], errors=[], samples=[], type=NODE_TYPES.FUNCTION, expression=toExpr(inputNums)) => (
  {id: toNodeId(idNum), errors, samples, type, expression}
)

describe.only('toDAG', () => {
  const simpleValidNodeList = [makeNode(1), makeNode(2, [1,3]), makeNode(3, [1])]
  it('Yields nodes ordered by height', () => {
    const {DAG, errorNodes} = toDAG(simpleValidNodeList)

    expect(errorNodes).to.be.empty
    expect(DAG.map(n => n.id)).to.deep.equal(['node:1', 'node:3', 'node:2'])
  })
  it ('Correclty assignes nodes their relations', () => {
    const {DAG, _1} = toDAG(simpleValidNodeList)

    expect(DAG.map(n => _.pick(n, ['parents', 'children']))).to.deep.have.members([
      {parents: [0,1], children: []},
      {parents: [], children: [1,2]},
      {parents: [0], children: [2]},
    ])
  })

  const missingInputsNodeList = [makeNode(1, ['missing']), makeNode(2, [1]), makeNode(3, [4]), makeNode(4), makeNode(5, [2,3])]
  it ('Correctly flags missing input errors', () => {
    const {DAG, errorNodes} = toDAG(missingInputsNodeList)

    expect(errorNodes.map(n => n.id)).to.have.members(['node:1', 'node:2', 'node:5'])
    expect(DAG.map(n => n.id)).to.deep.equal(['node:4', 'node:3'])
  })
  it ('Produces appropriately typed errors', () => {
    const {DAG, errorNodes} = toDAG(missingInputsNodeList)

    errorNodes.forEach(n => { n.errors.forEach( e => {expect(e.type).to.equal(GRAPH_ERROR)} ) })

    const subTypes = _.flatten(errorNodes.map(n => n.errors.map(e => e.subType)))
    expect(subTypes).to.have.members([MISSING_INPUT_ERROR, INVALID_ANCESTOR_ERROR, INVALID_ANCESTOR_ERROR])
  })

  const infiniteLoopNodeList = [makeNode(1, [2]), makeNode(2, [1]), makeNode(3, [1]), makeNode(4), makeNode(5, [4])]
  it ('Correctly flags infinite loop errors', () => {
    const {DAG, errorNodes} = toDAG(infiniteLoopNodeList)

    expect(errorNodes.map(n => n.id)).to.have.members(['node:1', 'node:2', 'node:3'])
    expect(DAG.map(n => n.id)).to.deep.equal(['node:4', 'node:5'])
  })
  it ('Produces appropriately typed errors', () => {
    const {DAG, errorNodes} = toDAG(infiniteLoopNodeList)

    errorNodes.forEach(n => { n.errors.forEach( e => {expect(e.type).to.equal(GRAPH_ERROR)} ) })

    const subTypes = _.flatten(errorNodes.map(n => n.errors.map(e => e.subType)))
    expect(subTypes).to.have.members([IN_INFINITE_LOOP, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR])
  })

  const errorDataNodeList = [makeNode(1, ['missing', 'gone']), makeNode(2, [1, 3]), makeNode(3, [4]), makeNode(4, [3])]

  it ('Assigns the correct auxilary error data', () => {
    const {DAG, errorNodes} = toDAG(errorDataNodeList)

    const invalidAncestorError = _collections.get(_.flatten(errorNodes.map(n => n.errors)), INVALID_ANCESTOR_ERROR, 'subType')
    expect(invalidAncestorError.ancestors).to.have.members(['node:3', 'node:1'])

    const missingInputError = _collections.get(_.flatten(errorNodes.map(n => n.errors)), MISSING_INPUT_ERROR, 'subType')
    expect(missingInputError.missingInputs).to.have.members(['node:missing', 'node:gone'])
  })
})
