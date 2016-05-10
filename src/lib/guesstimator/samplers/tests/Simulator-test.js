import {neededSamples} from '../Simulator.js';
import {expect} from 'chai';

const n = 5000

describe('Simulator', () => {
  describe('#neededSamples', () => {
    const examples = [
      [{ text: '3', inputs: {}}, 1],
      [{ text: 'foofunction([4,5,3])', inputs: {AK: [3], BA: [5]}}, 1],

      [{ text: '3*AK*BA', inputs: {AK: [3,4], BA: [5]}}, 2],
      [{ text: '3*AK*BA', inputs: {AK: [3,3,3,3,3,4], BA: [5]}}, 6],
      [{ text: '3*AK*BA', inputs: {AK: [3,8], BA: [5,8]}}, 2],
      [{ text: '3*AK*BA', inputs: {AK: [3,8,7,2,3,4], BA: [5,8,7,1]}}, 12],

      [{ text: 'randomInt([4,5,3])', inputs: {AK: [3], BA: [5]}}, n],
      [{ text: 'random([4,5,3])', inputs: {AK: [3], BA: [5]}}, n],
      [{ text: '1 + pickRandom([4,5,3])', inputs: {AK: [3], BA: [5]}}, n],
    ]

    examples.map(e => () => {
      it(`with inputs ${JSON.stringify(e[0])}, is ${e[1]} `, () => {
        const inputs = e[0]
        expect(neededSamples(inputs.text, inputs.inputs, n)).to.equal(e[1])
      })
    }).map(e => e())
  })
})
