import {expect} from 'chai'

import * as utils from './utils'

import {SimulationDAG} from '../DAG'
import {SimulationNode} from '../node'
import * as errorTypes from '../errors'

import * as _collections from 'gEngine/collections'
import * as _utils from 'gEngine/utils'

const {
  ERROR_TYPES: {GRAPH_ERROR, SAMPLING_ERROR, PARSER_ERROR},
  ERROR_SUBTYPES: {
    GRAPH_ERROR_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR},
    SAMPLING_ERROR_SUBTYPES: {DIVIDE_BY_ZERO_ERROR},
    PARSER_ERROR_SUBTYPES: {MISSING_FUNCTION_BODY},
  },
} = errorTypes

describe('Simulation Node', () => {
  describe('#_getInputs', () => {
    let DAG = new SimulationDAG([
      {id: 'A', expression: '3', samples: [3]},
      {id: 'B', expression: '4', samples: [4]},
      {id: 'C', expression: '${A} + ${B}'},
    ])

    it ('gets the correct inputs', () => {
      //debugger
      expect(DAG.find('C')._getInputs()).to.deep.equal({
        A: [3],
        B: [4],
      })
    })
  })

  describe('#_addErrorToDescendants', () => {
    let DAG = new SimulationDAG([
      {id: '1', expression: '0'},
      {id: '2', expression: '${1}'},
      {id: '3', expression: '${2}'},
    ])

    it ('adds an error to descendants', () => {
      expect(DAG.find('2').errors).to.be.empty
      expect(DAG.find('3').errors).to.be.empty

      DAG.find('1')._addErrorToDescendants()

      expect(DAG.find('2').errors).to.have.deep.members([
        {type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, inputs: ['1'], ancestors: []},
      ])
      expect(DAG.find('3').errors).to.have.deep.members([
        {type: GRAPH_ERROR, subType: INVALID_ANCESTOR_ERROR, inputs: [], ancestors: ['1']},
      ])
    })
  })

  describe('#_clearErrorToDescendants', () => {
    let DAG = new SimulationDAG([
      {id: 'i', expression: '1/0', errors: [{type: SAMPLING_ERROR, subType: DIVIDE_BY_ZERO_ERROR}]},
      {id: 'ii', expression: '${i}'},
      {id: 'iii', expression: '${ii}'},
    ])

    it ('adds an error to descendants', () => {
      expect(DAG.find('ii').errors).to.not.be.empty
      expect(DAG.find('iii').errors).to.not.be.empty

      DAG.find('i')._clearErrorFromDescendants()

      expect(DAG.find('ii').errors).to.be.empty
      expect(DAG.find('iii').errors).to.be.empty
    })
  })

  describe('#_simulate', () => {
    let DAG = new SimulationDAG([
      {id: 'a', expression: '=${foo}', errors: [
        {type: PARSER_ERROR, subType: MISSING_FUNCTION_BODY},
        {type: GRAPH_ERROR, subType: MISSING_INPUT_ERROR},
        {type: SAMPLING_ERROR, subType: DIVIDE_BY_ZERO_ERROR},
      ]},
    ])

    it ('clears the parse error before returning but not the graph error or worker error', () => {
      const node = DAG.find('a')
      node.simulate(5).then(({samples, errors}) => {
        expect(errors).to.deep.have.members([
          {type: GRAPH_ERROR, subType: MISSING_INPUT_ERROR},
          {type: SAMPLING_ERROR, subType: DIVIDE_BY_ZERO_ERROR},
        ])
        expect(samples).to.be.empty
      })
    })
  })
})
