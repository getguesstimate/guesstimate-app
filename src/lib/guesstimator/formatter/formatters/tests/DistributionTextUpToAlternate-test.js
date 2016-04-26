import {item as formatter} from '../DistributionTextUpToAlternate.js'

describe('DistributionTextUpTo', () => {
  describe('#matches', () => {
    const examples = [
      [{text: '[8,10]', guesstimateType: 'UNIFORM'}, true],
      [{text: '[8,10', guesstimateType: 'UNIFORM'}, true],
      [{text: '8,10]', guesstimateType: 'UNIFORM'}, false],
    ]

    examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.matches(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#format', () => {
    const examples = [
      [{text: '[8, 10]'}, {guesstimateType: 'LOGNORMAL', low: 8, high: 10}],
      [{text: '[-8, 10]'}, {guesstimateType: 'NORMAL', low: -8, high: 10}],
      [{text: '[8, 10]', guesstimateType: 'UNIFORM'}, {guesstimateType: 'UNIFORM', low: 8, high: 10}], [{text: '[8,10]', guesstimateType: 'NORMAL'}, {guesstimateType: 'NORMAL', low: 8, high: 10}],
      [{text: '[-5, 5]', guesstimateType: 'NORMAL'}, {guesstimateType: 'NORMAL', low: -5, high: 5}],
      [{text: '[0, 5]', guesstimateType: 'NORMAL'}, {guesstimateType: 'NORMAL', low: 0, high: 5}],
    ]

    examples.map(e => () => {
      it(`guesstimate ${JSON.stringify(e[0])} converts to ${JSON.stringify(e[1])}`, () => {
        expect(formatter.format(e[0])).to.deep.equal(e[1])
      })
    }).map(e => e())
  });
})
