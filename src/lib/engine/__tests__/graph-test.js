import {dependencyMap} from '../dgraph.js'

import {expect} from 'chai'

let dMetrics = [
  {
    id: 'A1',
    readableId: 'A1',
    guesstimate: {
      expression: '=5000/50',
      input: '=5000/50',
      metric: 'A1'
    }
  },
  {
    id: 'A2',
    readableId: 'A2',
    guesstimate: {
      expression: '=${metric:A1} + 1',
      input: '=A1 + 1',
      metric: 'A2'
    }
  },
  {
    id: 'A3',
    readableId: 'A3',
    guesstimate: {
      expression: '=${metric:A1} - 1',
      input: '=A1 - 1',
      metric: 'A3'
    }
  },
  {
    id: 'A4',
    readableId: 'A4',
    guesstimate: {
      expression: '=${metric:A2} + ${metric:A3}',
      input: '=A2 + ${metric:A3}',
      metric: 'A4'
    }
  },
  {
    id: 'A5',
    readableId: 'A5',
    guesstimate: {
      expression: '=${metric:A4} + 23',
      input: '=A4 + 23',
      metric: 'A5'
    }
  },
  {
    id: 'A6',
    readableId: 'A6',
    guesstimate: {
      expression: '323',
      input: '323',
      metric: 'A6'
    }
  }
]

let metrics = [
  {
    id: 'A1',
    readableId: 'A1',
  },
  {
    id: 'A2',
    readableId: 'A2',
  },
  {
    id: 'A3',
    readableId: 'A3',
  },
  {
    id: 'A4',
    readableId: 'A4',
  },
  {
    id: 'A5',
    readableId: 'A5',
  },
  {
    id: 'A6',
    readableId: 'A6',
  }
]

let guesstimates = [
  {
    expression: '=5000/50',
    input: '=5000/50',
    metric: 'A1'
  },
  {
    expression: '=${metric:A1} + 1',
    input: '=A1 + 1',
    metric: 'A2'
  },
  {
    expression: '=${A1} - 1',
    input: '=A1 - 1',
    metric: 'A3'
  },
  {
    expression: '=${A2} + ${A3}',
    input: '=A2 + ${A3}',
    metric: 'A4'
  },
  {
    expression: '=${A4} + 23',
    input: '=A4 + 23',
    metric: 'A5'
  },
  {
    expression: '323',
    input: '323',
    metric: 'A6'
  }
]

let dGraph = {metrics: dMetrics}

let graph = {metrics, guesstimates}

describe('graph', () => {
  describe('dependencyMap', () => {
    it('works', () => {
      let result = [
        {input: 'A1', output: 'A2'},
        {input: 'A1', output: 'A3'},
        {input: 'A2', output: 'A4'},
        {input: 'A3', output: 'A4'},
        {input: 'A4', output: 'A5'},
      ]
      expect(dependencyMap(dGraph)).to.deep.equal(result)
    })
  })
})
