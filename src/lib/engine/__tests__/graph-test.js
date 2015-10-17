import {dependencyMap} from '../dgraph.js';
import {dependencyTree} from '../graph.js';

import {expect} from 'chai';

let metrics = [
  {
    id: 'A1',
    readableId: 'A1',
    guesstimate: { input: '=5000/50' }
  },
  {
    id: 'A2',
    readableId: 'A2',
    guesstimate: { input: '=A1 + 1' }
  },
  {
    id: 'A3',
    readableId: 'A3',
    guesstimate: { input: '=A1 - 1' }
  },
  {
    id: 'A4',
    readableId: 'A4',
    guesstimate: { input: '=A2 + A3' }
  },
  {
    id: 'A5',
    readableId: 'A5',
    guesstimate: { input: '=A4 + 23' }
  },
  {
    id: 'A6',
    readableId: 'A6',
    guesstimate: { input: '323' }
  }
]

let dGraph = {metrics}

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
      expect(dependencyMap(dGraph)).to.deep.equal(result);
    });
  });

  describe('dependencyTree', () => {
    it('for metric 0', () => {
      let result = [
        ['A1', 0],
        ['A2', 1],
        ['A3', 1],
        ['A4', 2],
        ['A5', 3]
      ]
      expect(dependencyTree(dGraph, 'A1')).to.deep.equal(result)
    });

    it('for metric 4', () => {
      let result = [
        ['A4', 0],
        ['A5', 1]
      ]
      expect(dependencyTree(dGraph, 'A4')).to.deep.equal(result)
    });
  });
});
