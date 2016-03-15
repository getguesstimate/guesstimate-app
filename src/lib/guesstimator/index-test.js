import {Guesstimator} from './index.js';
import {expect} from 'chai';

describe('Guesstimator', () => {
  describe('.parse', () => {
    it('works with a simple function', () => {
      const input = {text: '=34'}
      const [errors, item] = Guesstimator.parse(input)
      expect(errors.length).to.eq(0)

      const parsedInput = item.parsedInput
      expect(parsedInput.guesstimateType).to.eq('FUNCTION')
      expect(parsedInput.text).to.eq('34')
    });
  })

  describe('.samplerTypes', () => {
    it('has many samplerTypes', () => {
      expect(Guesstimator.samplerTypes.all.length).to.be.above(4)
    })
  })

  describe('#samplerType', () => {
    it('has many samplerTypes', () => {
      const input = {text: '=34'}
      const [errors, item] = Guesstimator.parse(input)
      expect(item.samplerType().referenceName).to.eq('FUNCTION')
    })
  })

  describe('#sample', () => {
    it('a function with no inputs', () => {
      const input = {text: '=34'}
      const [errors, item] = Guesstimator.parse(input)
      const samples = item.sample(5)
      expect(samples.values).to.deep.eq([34])
    })

    describe('with a formatting error', () => {
      const parsedInput = {guesstimateType: 'POINT', value: 3}
      const parsedErrors = ['Terrible Error!']
      const guesstimator = new Guesstimator({parsedInput, parsedErrors})

      it(`does not sample`, () => {
        expect(guesstimator.sample(1).values.length).to.equal(0)
      })

      it(`returns errors`, () => {
        expect(guesstimator.sample(1).errors).to.deep.equal(parsedErrors)
      })
    })

    describe('normal guesstimateType', () => {
      const examples = [
        [{guesstimateType: 'NORMAL', low: 9, high: 10}, 1],
        [{guesstimateType: 'NORMAL', low: 9, high: 10}, 2],
        [{guesstimateType: 'NORMAL', low: 9, high: 10}, 10]
      ]

      examples.map(e => () => {
        it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has correct number of values`, () => {
          const _sample = new Guesstimator({parsedInput: e[0]}).sample(e[1])
          expect(_sample.values.length).to.equal(e[1])
        })

        it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has reasonable first value`, () => {
          const _sample = new Guesstimator({parsedInput: e[0]}).sample(e[1])
          expect(_sample.values[0]).to.be.within(0, 30)
        })
      }).map(e => e())
    })

    describe('point guesstimateType', () => {
      it('works', () => {
        const parsedInput = {guesstimateType: 'POINT', value: 3}
        const guesstimator = new Guesstimator({parsedInput})
        expect(guesstimator.sample(1).values).to.deep.equal([3])
        expect(guesstimator.sample(10).values).to.deep.equal([3])
      });
    })

    describe('data guesstimateType', () => {
      it('works with one element', () => {
        const parsedInput = {guesstimateType: 'DATA', data: [3]}
        const guesstimator = new Guesstimator({parsedInput})
        expect(guesstimator.sample(5).values[0]).to.deep.equal(3)
      });
      it('works when undersampling', () => {
        const parsedInput = {guesstimateType: 'DATA', data: [1,2,3]}
        const guesstimator = new Guesstimator({parsedInput})
        expect(guesstimator.sample(5).values.length).to.deep.equal(5)
      });
      it('works when oversampling', () => {
        const parsedInput = {guesstimateType: 'DATA', data: [1,2,3,4,5,6,7]}
        const guesstimator = new Guesstimator({parsedInput})
        expect(guesstimator.sample(5).values.length).to.deep.equal(5)
      });
    })

    describe('function guesstimateType', () => {
      const examples = [
        [{guesstimateType: 'FUNCTION', text: '3'}, {}, 1, 3],
        [{guesstimateType: 'FUNCTION', text: '3*AK'}, {AK: [3]}, 1, 9],
        [{guesstimateType: 'FUNCTION', text: '(3*AK)+BA'}, {AK: [3], BA: [2]}, 1, 11],
      ]

      examples.map(e => () => {
        it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has correct number of values`, () => {
          const guesstimator = new Guesstimator({parsedInput: e[0]})
          const _sample = guesstimator.sample(e[2], e[1])
          expect(_sample.values.length).to.equal(e[2])
        })

        it(`guesstimate ${JSON.stringify(e[0])} with value count ${e[1]} has correct first value`, () => {
          const guesstimator = new Guesstimator({parsedInput: e[0]})
          const _sample = guesstimator.sample(e[2], e[1])
          expect(_sample.values[0]).to.equal(e[3])
        })
      }).map(e => e())
    })
  })
})
