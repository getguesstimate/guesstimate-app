import {Guesstimator} from './guesstimator.js';
import {expect} from 'chai';

describe.only('Guesstimator', () => {
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
      expect(Guesstimator.samplerTypes().all.length).to.be.above(4)
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
  })
})
