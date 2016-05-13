import {Evaluate} from '../simulator/evaluator.js';
import {expect} from 'chai';

describe('Simulator', () => {
  describe('#evaluate', () => {
    it('a function with no inputs', () => {
      const samples = Evaluate('34', 1, [])
      expect(samples.values).to.deep.eq([34])
    })

    describe('function guesstimateType', () => {
      const examples = [
        ['3', {}, 1, 3],
        ['3*AK', {AK: [3]}, 1, 9],
        ['(3*AK)+BA', {AK: [3], BA: [2]}, 1, 11],
      ]

      examples.map(e => () => {
        const _sample = Evaluate(e[0], e[2], e[1])
        it(`guesstimate ${e[0]} with value count ${e[1]} has correct number of values`, () => {
          expect(_sample.values.length).to.equal(e[2])
        })

        it(`guesstimate ${e[0]} with value count ${e[1]} has correct first value`, () => {
          expect(_sample.values[0]).to.equal(e[3])
        })
      }).map(e => e())
    })
  })
})
