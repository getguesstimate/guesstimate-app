import {expect} from 'chai'

import {SimulationDAG} from '../simulationDAG'
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
const makeNode = (idNum, inputNums=[], samples=[], errors=[], type=NODE_TYPES.FUNCTION, expression=toExpr(inputNums)) => (
  {id: toNodeId(idNum), errors, samples, type, expression}
)

const expectNodesToBe = (DAG, validIds, errorIds) => {
  expect(DAG.errorNodes.map(n => n.id)).to.deep.equal(errorIds.map(toNodeId))
  expect(DAG.nodes.map(n => n.id)).to.deep.equal(validIds.map(toNodeId))
}

describe('construction', () => {
  const simpleValidNodeList = [makeNode(1), makeNode(2, [1,3]), makeNode(3, [1])]
  it ('Yields nodes ordered by height', () => {expectNodesToBe(new SimulationDAG(simpleValidNodeList), [1,3,2], [])})
  it ('Correclty assignes nodes their relations', () => {
    const DAG = new SimulationDAG(simpleValidNodeList)

    expect(DAG.nodes.map(n => _.pick(n, ['parents', 'children']))).to.deep.have.members([
      {parents: [0,1], children: []},
      {parents: [], children: [1,2]},
      {parents: [0], children: [2]},
    ])
  })

  const ancestorsNodeList = [makeNode(1), makeNode(2, [1]), makeNode(3, [2]), makeNode(4, [2]), makeNode(5, [2,3,4]), makeNode(6, [1])]
  it ('Correctly assigns ancestors', () => {
    const ancestorsList = (new SimulationDAG(ancestorsNodeList)).nodes.map(n => _.get(n, 'ancestors'))
    expect(ancestorsList).to.deep.have.members([
      [],
      [1].map(toNodeId),
      [2,1].map(toNodeId),
      [2,1].map(toNodeId),
      [2,3,4,1].map(toNodeId),
      [1].map(toNodeId),
    ])
  })

  const missingInputsNodeList = [makeNode(1, ['missing']), makeNode(2, [1]), makeNode(3, [4]), makeNode(4), makeNode(5, [2,3])]
  it ('Correctly flags missing input errors', () => {expectNodesToBe(new SimulationDAG(missingInputsNodeList), [4,3], [1,2,5])})
  it ('Produces appropriately typed errors', () => {
    const DAG = new SimulationDAG(missingInputsNodeList)

    DAG.errorNodes.forEach(n => { n.errors.forEach( e => {expect(e.type).to.equal(GRAPH_ERROR)} ) })

    const subTypes = _.flatten(DAG.errorNodes.map(n => n.errors.map(e => e.subType)))
    expect(subTypes).to.have.members([MISSING_INPUT_ERROR, INVALID_ANCESTOR_ERROR, INVALID_ANCESTOR_ERROR])
  })

  const infiniteLoopNodeList = [makeNode(1, [2]), makeNode(2, [1]), makeNode(3, [1]), makeNode(4), makeNode(5, [4])]
  it ('Correctly flags infinite loop errors', () => {
    const DAG = new SimulationDAG(infiniteLoopNodeList)

    expect(DAG.errorNodes.map(n => n.id)).to.have.members(['node:1', 'node:2', 'node:3'])
    expect(DAG.nodes.map(n => n.id)).to.deep.equal(['node:4', 'node:5'])
  })
  it ('Produces appropriately typed errors', () => {
    const DAG = new SimulationDAG(infiniteLoopNodeList)

    DAG.errorNodes.forEach(n => { n.errors.forEach( e => {expect(e.type).to.equal(GRAPH_ERROR)} ) })

    const subTypes = _.flatten(DAG.errorNodes.map(n => n.errors.map(e => e.subType)))
    expect(subTypes).to.have.members([IN_INFINITE_LOOP, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR])
  })

  const errorDataNodeList = [makeNode(1, ['missing', 'gone']), makeNode(2, [1, 3]), makeNode(3, [4]), makeNode(4, [3])]

  it ('Assigns the correct auxilary error data', () => {
    const DAG = new SimulationDAG(errorDataNodeList)

    const invalidAncestorError = _collections.get(_.flatten(DAG.errorNodes.map(n => n.errors)), INVALID_ANCESTOR_ERROR, 'subType')
    expect(invalidAncestorError.ancestors).to.have.members(['node:3', 'node:1'])

    const missingInputError = _collections.get(_.flatten(DAG.errorNodes.map(n => n.errors)), MISSING_INPUT_ERROR, 'subType')
    expect(missingInputError.missingInputs).to.have.members(['node:missing', 'node:gone'])
  })
})

describe('member functions', () => {
  const simpleNodeList = [makeNode(1), makeNode(2), makeNode(3)]
  it ('Should be able to find a node by id', () => {
    const DAG = new SimulationDAG(simpleNodeList)
    expect(DAG.find(toNodeId(2)).id).to.equal(toNodeId(2))
  })

  const complexRelations = [
    makeNode(1),
    makeNode(2, [1]),
    makeNode(3, [2]),
    makeNode(4, [2]),
    makeNode(5, [1]),
    makeNode(6, [1,4]),
    makeNode(7, [5]),
    makeNode(8),
    makeNode(9, [8]),
    makeNode(10, [9]),
  ]
  it ('Should generate the right subset', () => {
    const subsetIds = (new SimulationDAG(complexRelations)).subsetFrom([2, 8].map(toNodeId)).map(n => n.id)
    expect(subsetIds).to.have.members([2,3,4,6,8,9,10].map(toNodeId))
  })
})

describe('node functions', () => {
  const simpleNodeList = [makeNode(1), makeNode(2, [1]), makeNode(3, [1,2])]
  it ('should add errors to the right children', () => {
    let DAG = new SimulationDAG(simpleNodeList)
    const node = DAG.find(toNodeId(1))
    expect(node).to.be.ok

    node.addErrorToDescendants()
    expect(DAG.find(toNodeId(2)).errors).to.deep.have.members([{type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [toNodeId(1)]}])
    expect(DAG.find(toNodeId(3)).errors).to.deep.have.members([{type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [toNodeId(1)]}])
  })

  const withSamples = [makeNode(1, [4], [3]), makeNode(2, [4], [4]), makeNode(3, [1,2]), makeNode(4, [], [5])]
  it ('should get the right inputs', () => {
    const DAG = new SimulationDAG(withSamples)
    const node = DAG.find(toNodeId(3))
    expect(node).to.be.ok

    const inputs = node.getInputs()
    expect(inputs).to.have.property(toNodeId(1)).that.deep.equals([3])
    expect(inputs).to.have.property(toNodeId(2)).that.deep.equals([4])
  })
})
