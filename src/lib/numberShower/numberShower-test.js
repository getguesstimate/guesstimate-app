import {expect} from 'chai';
import numberShow from './numberShower.js'

describe('NumberShow', () => {
  describe('#with two units of precision', () => {
    const examples = [
      [0, {value: '0', symbol: undefined, power: undefined}],
      [-20, {value: '-20', symbol: undefined, power: undefined}],
      [-0.5, {value: '-0.5', symbol: undefined, power: undefined}],

      [0.5, {value: '0.5', symbol: undefined, power: undefined}],
      [0.501, {value: '0.5', symbol: undefined, power: undefined}],
      [0.01, {value: '0.01', symbol: undefined, power: undefined}],
      [0.001, {value: '1', symbol: undefined, power: -3}],
      [0.000012, {value: '1.2', symbol: undefined, power: -5}],
      [1.2e-25, {value: '1.2', symbol: undefined, power: -25}],
      [1.2e-100, {value: '1.2', symbol: undefined, power: -100}],

      [1, {value: '1', symbol: undefined, power: undefined}],
      [1.1, {value: '1.1', symbol: undefined, power: undefined}],
      [1, {value: '1', symbol: undefined, power: undefined}],
      [1, {value: '1', symbol: undefined, power: undefined}],
      [10, {value: '10', symbol: undefined, power: undefined}],
      [10, {value: '10', symbol: undefined, power: undefined}],
      [100, {value: '100', symbol: undefined, power: undefined}],
      [1000, {value: '1000', symbol: undefined, power: undefined}],
      [10000, {value: '10', symbol: 'K', power: undefined}],
      [100000, {value: '100', symbol: 'K', power: undefined}],
      [100001, {value: '100', symbol: 'K', power: undefined}],
      [110001, {value: '110', symbol: 'K', power: undefined}],
      [1000000, {value: '1', symbol: 'M', power: undefined}],
      [10000000, {value: '10', symbol: 'M', power: undefined}],
      [1000000000, {value: '1', symbol: 'B', power: undefined}],
      [1000000000000, {value: '1', symbol: 'T', power: undefined}],
      [100000000000000, {value: '100', symbol: 'T', power: undefined}],
      [110000000000000, {value: '110', symbol: 'T', power: undefined}],
      [1000000000000000, {value: '1', symbol: undefined, power: 15}],
      [1200000000000000, {value: '1.2', symbol: undefined, power: 15}],
      [1.2e+25, {value: '1.2', symbol: undefined, power: 25}],
      [1.2e+100, {value: '1.2', symbol: undefined, power: 100}],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for number ${e[0]}`, () => {
        expect(numberShow(e[0]).value).to.equal(e[1].value)
        expect(numberShow(e[0]).symbol).to.equal(e[1].symbol)
        expect(numberShow(e[0]).power).to.equal(e[1].power)
      })
    })
    itExamples.map(e => e())
  })
})
