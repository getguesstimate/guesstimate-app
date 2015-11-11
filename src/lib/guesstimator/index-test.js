import {sample} from './index.js';
import {expect} from 'chai';

describe('sample', () => {
  describe('normal guesstimateType', () => {
    const examples = [
      [{guesstimateType: 'NORMAL', low: 9, high: 10}, 1],
      [{guesstimateType: 'NORMAL', low: 9, high: 10}, 2],
      [{guesstimateType: 'NORMAL', low: 9, high: 10}, 10]
    ]

    examples.map(e => () => {
      it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has correct number of values`, () => {
        const _sample = sample(e[0], e[1])
        expect(_sample.values.length).to.equal(e[1])
      })

      it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has reasonable first value`, () => {
        const _sample = sample(e[0], e[1])
        expect(_sample.values[0]).to.be.within(0, 30)
      })
    }).map(e => e())
  })

  describe('point guesstimateType', () => {
    it('works', () => {
      const input = {guesstimateType: 'POINT', value: 3}
      expect(sample(input, 1).values).to.deep.equal([3])
      expect(sample(input, 10).values).to.deep.equal([3])
    });
  })

  describe('function guesstimateType', () => {
    const examples = [
      [{guesstimateType: 'FUNCTION', text: '3', inputs: {}}, 1, 3],
      [{guesstimateType: 'FUNCTION', text: '3*AK', inputs: {AK: [3]}}, 1, 9],
      [{guesstimateType: 'FUNCTION', text: '(3*AK)+BA', inputs: {AK: [3], BA: [2]}}, 1, 11],
    ]

    examples.map(e => () => {
      it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has correct number of values`, () => {
        const _sample = sample(e[0], e[1])
        expect(_sample.values.length).to.equal(e[1])
      })

      it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has correct first value`, () => {
        const _sample = sample(e[0], e[1])
        expect(_sample.values[0]).to.equal(e[2])
      })
    }).map(e => e())
  })
})
