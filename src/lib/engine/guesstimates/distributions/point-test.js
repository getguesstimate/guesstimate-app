import {Distribution, Formatter, Sampler} from './point.js';
import {expect} from 'chai';

describe.only('Distribution', () => {
  describe('#sample', () => {
    it('works', () => {
      const sample = Distribution.sample({input: '5'}, 10)
      expect(sample.values.length).to.equal(1)
      expect(sample.values).to.deep.equal([5])
    })
  });
})

describe('Formatter', () => {
  describe('#isA', () => {
    const examples = [
      [{distributionType: 'PointDistribution'}, true],
      [{distributionType: 'NormalDistribution'}, false],
      [{input: '3'}, true],
      [{value: '3'}, false],
      [{input: '=3'}, false],
      [{input: '3 -> 9'}, false]
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${e[0]}`, () => {
        expect(Formatter.isA(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#isValid', () => {
    const examples = [
      [{distributionType: 'PointDistribution', value: '3'}, true],
      [{distributionType: 'PointDistribution', value: 3}, true],
      [{distributionType: 'PointDistribution', value: null}, false],
      [{distributionType: 'PointDistribution'}, false],

      [{input: '3'}, true],
      [{input: 3}, true],
      [{input: 'd'}, false],
      [{}, false],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(Formatter.isValid(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#format', () => {
    const examples = [
      [{distributionType: 'PointDistribution', value: '3'}, {value: 3}],
      [{distributionType: 'PointDistribution', value: 3}, {value: 3}],

      [{input: '3'}, {value: 3}],
      [{input: 3}, {value: 3}],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(Formatter.format(e[0])).to.deep.equal(e[1])
      })
    }).map(e => e())
  });
});

describe('Sampler', () => {
  describe('#sample', () => {
    const examples = [
      [{value: 3}, 1,  [3]],
      [{value: 3.383838}, 1,  [3.383838]],
      [{value: 3}, 100,  [3]],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(Sampler.sample(e[0], e[1])).to.deep.equal({values: e[2]})
      })
    }).map(e => e())
  });
})
