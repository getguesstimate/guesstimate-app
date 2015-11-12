import {item as formatter} from '../DistributionNormalTextPlusMinus.js'

describe('DistributionNormalTextPlusMinus', () => {
  describe('#matches', () => {
    const examples = [
      [{text: '8+-10'}, true],
      [{text: '8-+10'}, true],
    ]

    examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.matches(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#format', () => {
    const examples = [
      [{text: '8+-1'}, {guesstimateType: 'NORMAL', low: 7, high: 9}],
    ]

    examples.map(e => () => {
      it(`guesstimate ${JSON.stringify(e[0])} converts to ${JSON.stringify(e[1])}`, () => {
        expect(formatter.format(e[0])).to.deep.equal(e[1])
      })
    }).map(e => e())
  });
})
