import {Sampler, isPure} from '../Function.js';
import {expect} from 'chai';

describe('Function Sampler', () => {
  describe('#isPure', () => {
    const examples = [
      [{ text: '3', inputs: {}}, true],
      [{ text: '3*AK*BA', inputs: {AK: [3], BA: [5,5,5,5,5]}}, true],
      [{ text: '3*AK*BA', inputs: {AK: [3], BA: [5,5,5,5,5]}}, true],
      [{ text: 'foofunction([4,5,3])', inputs: {AK: [3], BA: [5]}}, true],

      [{ text: '3*AK*BA', inputs: {AK: [3,4], BA: [5]}}, false],
      [{ text: '3*AK*BA', inputs: {AK: [3,3,3,3,3,4], BA: [5]}}, false],
      [{ text: '3*AK*BA', inputs: {AK: [3,8], BA: [5,8]}}, false],

      [{ text: 'randomInt([4,5,3])', inputs: {AK: [3], BA: [5]}}, false],
      [{ text: 'random([4,5,3])', inputs: {AK: [3], BA: [5]}}, false],
      [{ text: '1 + pickRandom([4,5,3])', inputs: {AK: [3], BA: [5]}}, false],
    ]

    examples.map(e => () => {
      it(`with inputs ${JSON.stringify(e[0])}, is ${e[1]} `, () => {
        const inputs = e[0]
        expect(isPure(inputs.text, inputs.inputs)).to.equal(e[1])
      })
    }).map(e => e())
  })
})
