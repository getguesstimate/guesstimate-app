import {Guesstimator} from './index.js';
import {expect} from 'chai';

describe('Guesstimator', () => {
  describe('.parse', () => {
    it('works with a simple function', () => {
      const input = {text: '=34'}
      const [error, item] = Guesstimator.parse(input)
      expect(_.isEmpty(error)).to.eq(true)

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
      const [error, item] = Guesstimator.parse(input)
      expect(item.samplerType().referenceName).to.eq('FUNCTION')
    })
  })
})
