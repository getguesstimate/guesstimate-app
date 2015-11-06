import {Distribution, Formatter, Sampler} from './normal';
import {expect} from 'chai';

describe('Distribution', () => {
  describe.only('#sample', () => {
    it('works', () => {
      const sample = Distribution.sample({input: '8->1'}, 10)
      expect(sample.values.length).to.equal(10)
      expect(sample.values[0]).to.be.within(0, 30)
    })
  });
})

describe('Formatter', () => {
  describe('#isA', () => {
    const examples = [
      [{distributionType: 'NormalDistribution'}, true],
      [{distributionType: 'PointDistribution'}, false],

      [{input: '3'}, false],
      [{input: '=3'}, false],
      [{input: '3->8'}, true],
      [{input: '3->10'}, true],
      [{input: '3->d'}, true]
    ]

    examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(Formatter.isA(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#isValid', () => {
    describe('#manualFormatter', () => {
      const examples = [
        [{distributionType: 'NormalDistribution', low: '3', high: '9'}, true],
        [{distributionType: 'NormalDistribution', low: 'd', high: '9'}, false],
        [{distributionType: 'NormalDistribution', low: '3'}, false],
        [{distributionType: 'NormalDistribution', high: '3'}, false],
      ]

      examples.map(e => () => {
        it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
          expect(Formatter.isValid(e[0])).to.equal(e[1])
        })
      }).map(e => e())
    });

    describe('#inputFormatter', () => {
      const examples = [
        [{input: '3->8'}, true],
        [{input: '3->10'}, true],
        [{input: '3->d'}, false]
      ]

      examples.map(e => () => {
        it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
          expect(Formatter.isValid(e[0])).to.equal(e[1])
        })
      }).map(e => e())
    });
  });

  describe('#format', () => {
    describe('#manualFormatter', () => {
      const examples = [
        [{distributionType: 'NormalDistribution', low: '3', high: '9'}, {low: 3, high: 9}],
      ]

      examples.map(e => () => {
        it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
          expect(Formatter.format(e[0])).to.deep.equal(e[1])
        })
      }).map(e => e())
    });

    describe('#inputFormatter', () => {
      const examples = [
        [{input: '3->8'}, {low: 3, high: 8}],
        [{input: '3->10'}, {low: 3, high: 10}],
        [{input: '-3->10'}, {low: -3, high: 10}]
      ]

      examples.map(e => () => {
        it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
          expect(Formatter.format(e[0])).to.deep.equal(e[1])
        })
      }).map(e => e())
    });
  });
});

describe('Sampler', () => {
  describe('#sample', () => {
    const examples = [
      [{low: 9, high: 1}, 1],
      [{low: 9, high: 1}, 2],
      [{low: 9, high: 1}, 10]
    ]

    examples.map(e => () => {
      it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has correct number of values`, () => {
        const sample = Sampler.sample(e[0], e[1])
        expect(sample.values.length).to.equal(e[1])
      })

      it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has reasonable first value`, () => {
        const sample = Sampler.sample(e[0], e[1])
        expect(sample.values[0]).to.be.within(0, 30)
      })
    }).map(e => e())
  });
})
