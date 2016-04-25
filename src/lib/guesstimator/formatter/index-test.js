import {parse, formatters, _matchingFormatter} from './index.js'

describe('formatter', () => {
  describe('#formatters', () => {
    it('holds all formatters', () => {
      expect(formatters.length).to.be.above(3)
    })
  });

  describe('#_matchingFormatter', () => {
    const examples = [
      [{text: '=34'}, 'FUNCTION'],
      [{text: '34'}, 'DISTRIBUTION_POINT_TEXT'],
      [{text: '34 -> 88'}, 'DISTRIBUTION_NORMAL_TEXT_UPTO']
    ]

    const itExamples = examples.map(e => () => {
      it(`finds correct formatter for input ${JSON.stringify(e[0])}`, () => {
        expect(_matchingFormatter(e[0]).formatterName).to.equal(e[1])
      })
    }).map(e => e())
  });
})
