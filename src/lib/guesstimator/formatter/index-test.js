import {formatters, _matchingFormatter, format} from './index.js'

describe('formatter', () => {
  describe('#formatters', () => {
    it('holds all formatters', () => {
      expect(formatters.length).to.equal(5)
    })
  });

  describe('#_matchingFormatter', () => {
    const examples = [
      [{text: '=34'}, 'FUNCTION'],
      [{text: '34'}, 'DISTRIBUTION_POINT_TEXT'],
      [{guesstimateType: 'POINT'}, 'DISTRIBUTION_POINT_GRAPHICAL'],
      [{text: '34 -> 88'}, 'DISTRIBUTION_NORMAL_TEXT_UPTO'],
      [{text: '34 +- 88'}, 'DISTRIBUTION_NORMAL_TEXT_PLUS_MINUS']
    ]

    const itExamples = examples.map(e => () => {
      it(`finds correct formatter for input ${JSON.stringify(e[0])}`, () => {
        expect(_matchingFormatter(e[0]).formatterName).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#format', () => {
    const examples = [
      [{text: '=34', graph: {}}, {guesstimateType: 'FUNCTION', text: '34', inputs: {}}],
      [{text: '34'}, {guesstimateType: 'POINT', value: 34}],
      [{guesstimateType: 'POINT', value: '34'}, {guesstimateType: 'POINT', value: 34}],
      [{text: '8 -> 9'}, {guesstimateType: 'NORMAL', low: 8, high: 9}],
      [{text: '8 +- 1'},{guesstimateType: 'NORMAL', low: 7, high: 10}]
    ]

    examples.map(e => () => {
      it(`formats input ${JSON.stringify(e[0])}`, () => {
        expect(format(e[0]).guesstimateType).to.deep.equal(e[1].guesstimateType)
      })
    }).map(e => e())
  });
})
