import {expect} from 'chai';
import convert from './numberShower.js'

describe('NumberShower', () => {

  describe.only('#two uncertain units', () => {
    it('contains nodes', () => {
      expect(convert(5)).to.equal('5.0')
    })

    const examples = [
      [0.5, '0.50'],
      [0.501, '0.50'],
      [0.01, '0.010'],
      [1.0, '1.0'],
      [1.1, '1.1'],
      [1.00, '1.0'],
      [1, '1.0'],
      [10, '10'],
      [10.0, '10'],
      [100.0, '100'],
      [1000.0, '1.0K'],
      [10000.0, '10K'],
      [100000.0, '100K'],
      [100001.0, '100K'],
      [110001.0, '110K'],
      [1000000.0, '1.0M'],
      [10000000.0, '10M'],
      [1000000000.0, '1.0G'],
      [1000000000000.0, '1.0T'],
      [100000000000000.0, '100T'],
      [110000000000000.0, '110T'],
      [1000000000000000.0, '1.0x10^15'],
      [1.2 * Math.pow(10, 15), '1.2x10^15'],
      [1.2 * Math.pow(10, 25), '1.2x10^25']
    ]

    const foo = examples.map(e => () => {
      it(`works for number ${e[0]}`, () => {
        expect(convert(e[0])).to.equal(e[1])
      })
    })
    foo.map(e => e())
  })
})

