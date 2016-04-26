import {requiresManySamples, Evaluate} from '../simulator/evaluator.js';
import {expect} from 'chai';

const n = 5000

describe('Simulator', () => {
  describe('#requiresManySamples', () => {
    const examples = [
      [{ text: '3', inputs: {}}, false],
      [{ text: '3*AK*BA', inputs: {AK: [3], BA: [5,5,5,5,5]}}, false],
      [{ text: '3*AK*BA', inputs: {AK: [3], BA: [5,5,5,5,5]}}, false],
      [{ text: 'foofunction([4,5,3])', inputs: {AK: [3], BA: [5]}}, false],

      [{ text: '3*AK*BA', inputs: {AK: [3,4], BA: [5]}}, true],
      [{ text: '3*AK*BA', inputs: {AK: [3,3,3,3,3,4], BA: [5]}}, true],
      [{ text: '3*AK*BA', inputs: {AK: [3,8], BA: [5,8]}}, true],

      [{ text: 'randomInt([4,5,3])', inputs: {AK: [3], BA: [5]}}, true],
      [{ text: 'random([4,5,3])', inputs: {AK: [3], BA: [5]}}, true],
      [{ text: '1 + pickRandom([4,5,3])', inputs: {AK: [3], BA: [5]}}, true],
    ]

    examples.map(e => () => {
      it(`with inputs ${JSON.stringify(e[0])}, is ${e[1]} `, () => {
        const inputs = e[0]
        expect(requiresManySamples(inputs.text, inputs.inputs)).to.equal(e[1])
      })
    }).map(e => e())
  })

  describe('#evaluate', () => {
    it('a function with no inputs', () => {
      const samples = Evaluate('34', n, [])
      expect(samples.values).to.deep.eq([34])
    })

    describe('function guesstimateType', () => {
      const examples = [
        ['3', {}, 1, 3],
        ['3*AK', {AK: [3]}, 1, 9],
        ['(3*AK)+BA', {AK: [3], BA: [2]}, 1, 11],
      ]

      examples.map(e => () => {
        it(`guesstimate ${e[0]} with value count ${e[1]} has correct number of values`, () => {
          const _sample = Evaluate(e[0], e[2], e[1])
          expect(_sample.values.length).to.equal(e[2])
        })

        it(`guesstimate ${e[0]} with value count ${e[1]} has correct first value`, () => {
          const _sample = Evaluate(e[0], e[2], e[1])
          expect(_sample.values[0]).to.equal(e[3])
        })
      }).map(e => e())
    })
  })
})
