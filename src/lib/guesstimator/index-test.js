import {sample} from './index.js';
import {expect} from 'chai';

describe.only('sample', () => {
  describe('normal guesstimateType', () => {
    const examples = [
      [{distributionType: 'NORMAL', low: 9, high: 1}, 1],
      [{distributionType: 'NORMAL', low: 9, high: 1}, 2],
      [{distributionType: 'NORMAL', low: 9, high: 1}, 10]
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

  describe.only('point guesstimateType', () => {
    it('works', () => {
      const input = {guesstimateType: 'POINT', low: 5, high: 6}
      expect(sample(input)).to.deep.equal([3])
    });
  })
})
