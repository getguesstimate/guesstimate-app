import {expect} from 'chai'

import * as utils from './utils'

import {SimulationDAG} from '../DAG'
import * as errorTypes from '../errors'

import * as _collections from 'gEngine/collections'
import * as _utils from 'gEngine/utils'

const {
  ERROR_TYPES: {GRAPH_ERROR, SAMPLING_ERROR},
  ERROR_SUBTYPES: {
    GRAPH_ERROR_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR},
    SAMPLING_ERROR_SUBTYPES: {DIVIDE_BY_ZERO_ERROR},
  },
} = errorTypes

describe('Simulation DAG', () => {
  const nodes = [
    {id: 'A', expression: '3'},
    {id: 'B', expression: '${A}'},
    {id: 'C', expression: '${A}'},
    {id: 'D', expression: '${B}'},
    {id: 'E', expression: '${B}'},
    {id: 'F', expression: '${A} + ${C}'},

    {id: '1', expression: '0'},
    {id: '2', expression: '${3} + ${0} + ${1}'},
    {id: '3', expression: '${2}'},
    {id: '4', expression: '${3}'},
    {id: '5', expression: '1/0', errors: [{type: SAMPLING_ERROR, subType: DIVIDE_BY_ZERO_ERROR}]},
    {id: '6', expression: '${5}'},
    {id: '7', expression: '${6}'},
    {id: '8', expression: '${missing} + ${missing} + ${1} + ${gone}'},
  ]
  const DAG = new SimulationDAG(nodes)

  describe('error assignment', () => {
    it ('assigns errors properly', () => {
      const missingInputNode = _collections.get(DAG.nodes, '8')
      const infiniteLoopNodes = [_collections.get(DAG.nodes, '2'), _collections.get(DAG.nodes, '3')]
      const divZeroNode = _collections.get(DAG.nodes, '5')
      const childOfLoopNode = _collections.get(DAG.nodes, '4')
      const childOfDivZeroNode = _collections.get(DAG.nodes, '6')
      const grandchildOfDivZeroNode = _collections.get(DAG.nodes, '7')

      expect(missingInputNode.errors, 'Missing input errors are annotated correctly').to.have.deep.members([
        {type: GRAPH_ERROR, subType: MISSING_INPUT_ERROR, missingInputs: ['missing', 'gone']}
      ])

      expect(_.map(infiniteLoopNodes, 'errors'), 'Infinite loop nodes receive the correct errors').to.have.deep.members([
        [
          {type: GRAPH_ERROR, subType: IN_INFINITE_LOOP, cycleIds: ['2', '3']},
          {type: GRAPH_ERROR, subType: MISSING_INPUT_ERROR, missingInputs: ['0']},
        ], [
          {type: GRAPH_ERROR, subType: IN_INFINITE_LOOP, cycleIds: ['2', '3']},
          {type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [], inputs: ['2']},
        ]
      ])

      expect(divZeroNode.errors, 'Incoming errors are preserved through construction').to.have.deep.members([
        {type: SAMPLING_ERROR, subType: DIVIDE_BY_ZERO_ERROR}
      ])

      expect(childOfLoopNode.errors, 'Invalid ancestor errors for graph errors are annotated properly').to.have.deep.members([
        {type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: ['2'], inputs: ['3']},
      ])
      expect(childOfDivZeroNode.errors, 'Invalid ancestor errors for incoming errors are annotated properly').to.have.deep.members([
        {type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: [], inputs: ['5']}
      ])
      expect(grandchildOfDivZeroNode.errors, 'Invalid ancestor errors for distant relatives are annotated properly').to.have.deep.members([
        {type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, ancestors: ['5'], inputs: []}
      ])
    })
  })

  describe('#find', () => {
    it ('finds the correct nodes', () => {
      // TODO(matthew): Matches simulation node.
      expect(DAG.find('A').id).to.equal('A')
      expect(DAG.find('F').id).to.equal('F')
    })
  })
  describe('#subset', () => {
    it ('forms the correct subsets', () => {
      expect(DAG.subsetFrom(['A']).map(n => n.id), 'a subset from the root should include everything').to.deep.have.members([
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
      ])
      expect(DAG.subsetFrom(['C', 'E']).map(n => n.id), 'a subset from a list should include all relevant subsets').to.deep.have.members([
        'C',
        'E',
        'F',
      ])

      expect(DAG.subsetFrom(['1']).map(n => n.id), 'a subset containing graph errors should be correct').to.deep.have.members([
        '1',
        '2',
        '3',
        '4',
        '8',
      ])
      expect(DAG.subsetFrom(['5']).map(n => n.id), 'a subset containing incoming errors should be correct').to.deep.have.members([
        '5',
        '6',
        '7',
      ])
    })
  })
  describe('#strictSubset', () => {
    it ('forms the correct strict subsets', () => {
      expect(DAG.strictSubsetFrom('A').map(n => n.id)).to.deep.have.members([
        'B',
        'C',
        'D',
        'E',
        'F',
      ])
      expect(DAG.strictSubsetFrom('C', 'E').map(n => n.id)).to.deep.have.members([
        'F',
      ])
    })
  })
})
