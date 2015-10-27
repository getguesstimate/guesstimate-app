import {expect} from 'chai';
import convert from './numberShower.js'

describe('NumberShower', () => {

  describe.only('#two uncertain units', () => {
    it('contains nodes', () => {
      expect(convert(5)).to.equal('5')
    })
    const examples = [
      [1.0, '1.0'],
      [10.0, '10'],
      [100.0, '100'],
      [1000.0, '1.0k'],
      [10000.0, '10k'],
      [100000.0, '100k'],
      [1000000.0, '1.0M'],
      [10000000.0, '10M'],
      [1000000000.0, '1.0G'],
      [1000000000000.0, '1.0T'],
      [100000000000000.0, '100T']
    ]

    const foo = examples.map(e => () => {
      it(`works for number ${e[0]}`, () => {
        expect(convert(e[0])).to.equal('5')
      })
    })
    foo.map(e => e())
  })
})

