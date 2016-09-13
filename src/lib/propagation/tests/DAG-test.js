import {expect} from 'chai'

import * as utils from './utils'

import {SimulationDAG} from '../DAG'
import * as constants from '../constants'

import * as _collections from 'gEngine/collections'
import * as _utils from 'gEngine/utils'

// ERRORS:
const {
  ERROR_TYPES: {GRAPH_ERROR},
  ERROR_SUBTYPES: {GRAPH_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR, DUPLICATE_ID_ERROR}},
} = constants


describe('construction', () => {
  const simpleValidNodeList = [utils.makeNode(1), utils.makeNode(2, [1,3]), utils.makeNode(3, [1])]
  it ('Yields nodes ordered by height', () => {utils.expectNodesToBe(new SimulationDAG(simpleValidNodeList), [1,3,2], [])})
  it ('Correctly assigns nodes their relations', () => {
    const DAG = new SimulationDAG(simpleValidNodeList)

    expect(DAG.nodes.map(n => _.pick(n, ['parentIndices']))).to.deep.have.members([
      {parentIndices: [0,1]},
      {parentIndices: []},
      {parentIndices: [0]},
    ])
  })

  const ancestorsNodeList = [utils.makeNode(1), utils.makeNode(2, [1]), utils.makeNode(3, [2]), utils.makeNode(4, [2]), utils.makeNode(5, [2,3,4]), utils.makeNode(6, [1])]
  it ('Correctly assigns ancestors', () => {
    const ancestorsList = (new SimulationDAG(ancestorsNodeList)).nodes.map(n => _.get(n, 'ancestors'))
    expect(ancestorsList).to.deep.have.members([
      [],
      [1].map(utils.toNodeId),
      [2,1].map(utils.toNodeId),
      [2,1].map(utils.toNodeId),
      [2,3,4,1].map(utils.toNodeId),
      [1].map(utils.toNodeId),
    ])
  })

  const missingInputsNodeList = [utils.makeNode(1, ['missing']), utils.makeNode(2, [1,3]), utils.makeNode(3, [4]), utils.makeNode(4)]
  it ('Correctly flags missing input errors', () => {utils.expectNodesToBe(new SimulationDAG(missingInputsNodeList), [4,3,2], [1])})
  it ('Produces appropriately typed errors', () => {
    const DAG = new SimulationDAG(missingInputsNodeList)

    DAG.graphErrorNodes.forEach(n => { n.errors.forEach( e => {expect(e.type).to.equal(GRAPH_ERROR)} ) })

    const subTypes = _.flatten(DAG.graphErrorNodes.map(n => n.errors.map(e => e.subType)))
    expect(subTypes).to.have.members([MISSING_INPUT_ERROR])
  })

  const duplicateInputsNodeList = [utils.makeNode(1), utils.makeNode(1), utils.makeNode(3, [4]), utils.makeNode(4)]
  it ('Correctly flags duplicate input errors', () => {utils.expectNodesToBe(new SimulationDAG(duplicateInputsNodeList), [4,3], [1,1])})
  it ('Produces appropriately typed errors', () => {
    const DAG = new SimulationDAG(duplicateInputsNodeList)

    DAG.graphErrorNodes.forEach(n => { n.errors.forEach( e => {expect(e.type).to.equal(GRAPH_ERROR)} ) })

    const subTypes = _.flatten(DAG.graphErrorNodes.map(n => n.errors.map(e => e.subType)))
    expect(subTypes).to.have.members([DUPLICATE_ID_ERROR, DUPLICATE_ID_ERROR])
  })

  const infiniteLoopNodeList = [utils.makeNode(1, [2]), utils.makeNode(2, [1]), utils.makeNode(3), utils.makeNode(4, [3])]
  it ('Correctly flags missing input errors', () => {utils.expectNodesToBe(new SimulationDAG(infiniteLoopNodeList), [3,4], [1,2])})
  it ('Produces appropriately typed errors', () => {
    const DAG = new SimulationDAG(infiniteLoopNodeList)

    DAG.graphErrorNodes.forEach(n => { n.errors.forEach( e => {expect(e.type).to.equal(GRAPH_ERROR)} ) })

    const subTypes = _.flatten(DAG.graphErrorNodes.map(n => n.errors.map(e => e.subType)))
    expect(subTypes).to.have.members([IN_INFINITE_LOOP, IN_INFINITE_LOOP])
  })

  const errorDataNodeList = [utils.makeNode(1, ['missing', 'gone']), utils.makeNode(2, [1, 3]), utils.makeNode(3, [4]), utils.makeNode(4, [3])]

  it ('Assigns the correct auxilary error data', () => {
    const DAG = new SimulationDAG(errorDataNodeList)

    const invalidAncestorError = _collections.get(_.flatten(DAG.nodes.map(n => n.errors)).filter(_utils.isPresent), INVALID_ANCESTOR_ERROR, 'subType')
    expect(invalidAncestorError.ancestors).to.have.members(['node:3', 'node:1'])

    const missingInputError = _collections.get(_.flatten(DAG.graphErrorNodes.map(n => n.errors)), MISSING_INPUT_ERROR, 'subType')
    expect(missingInputError.missingInputs).to.have.members(['node:missing', 'node:gone'])
  })
})

describe('member functions', () => {
  const simpleNodeList = [utils.makeNode(1), utils.makeNode(2), utils.makeNode(3)]
  it ('Should be able to find a node by id', () => {
    const DAG = new SimulationDAG(simpleNodeList)
    expect(DAG.find(utils.toNodeId(2)).id).to.equal(utils.toNodeId(2))
  })

  const complexRelations = [
    utils.makeNode(1),
    utils.makeNode(2, [1]),
    utils.makeNode(3, [2]),
    utils.makeNode(4, [2]),
    utils.makeNode(5, [1]),
    utils.makeNode(6, [1,4]),
    utils.makeNode(7, [5]),
    utils.makeNode(8),
    utils.makeNode(9, [8]),
    utils.makeNode(10, [9]),
  ]
  it ('Should generate the right subset', () => {
    const subsetIds = (new SimulationDAG(complexRelations)).subsetFrom([2, 8].map(utils.toNodeId)).map(n => n.id)
    expect(subsetIds).to.have.members([2,3,4,6,8,9,10].map(utils.toNodeId))
  })
})

describe('node functions', () => {
  const simpleNodeList = [utils.makeNode(1), utils.makeNode(2, [1]), utils.makeNode(3, [1,2])]
  it ('should add errors to the right children', () => {
    let DAG = new SimulationDAG(simpleNodeList)
    const node = DAG.find(utils.toNodeId(1))
    expect(node).to.be.ok

    node._addErrorToDescendants()
    expect(DAG.find(utils.toNodeId(2)).errors).to.deep.have.members([{type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [utils.toNodeId(1)]}])
    expect(DAG.find(utils.toNodeId(3)).errors).to.deep.have.members([{type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [utils.toNodeId(1)]}])
  })

  const withSamples = [utils.makeNode(1, [4], [3]), utils.makeNode(2, [4], [4]), utils.makeNode(3, [1,2]), utils.makeNode(4, [], [5])]
  it ('should get the right inputs', () => {
    const DAG = new SimulationDAG(withSamples)
    const node = DAG.find(utils.toNodeId(3))
    expect(node).to.be.ok

    const inputs = node._getInputs()
    expect(inputs).to.have.property(utils.toNodeId(1)).that.deep.equals([3])
    expect(inputs).to.have.property(utils.toNodeId(2)).that.deep.equals([4])
  })
})
