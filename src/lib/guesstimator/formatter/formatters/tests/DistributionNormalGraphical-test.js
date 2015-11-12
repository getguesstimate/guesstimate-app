import {item as formatter} from '../DistributionNormalGraphical.js'

describe("DistributionNormalGraphical", () => {
  describe('#matches', () => {
    const examples = [
      [{guesstimateType: 'NORMAL'}, true],
      [{guesstimateType: 'POINT'}, false],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.matches(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#format', () => {
    const examples = [
      [
        {guesstimateType: 'NORMAL', high: '3', low: '1'},
        {guesstimateType: 'NORMAL', high: 3, low: 1, min: NaN, max: NaN}
      ],
      [
        {guesstimateType: 'NORMAL', high: 3, low: 1, min: 0, max: 5},
        {guesstimateType: 'NORMAL', high: 3, low: 1, min: 0, max: 5}
      ]
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.format(e[0])).to.deep.equal(e[1])
      })
    }).map(e => e())
  });
})
