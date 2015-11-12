import {item as formatter} from '../DistributionPointGraphical.js'

describe("DistributionPointGraphical", () => {
  describe('#matches', () => {
    const examples = [
      [{guesstimateType: 'POINT'}, true],
      [{guesstimateType: 'NORMAL'}, false],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.matches(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#format', () => {
    const examples = [
      [{guesstimateType: 'POINT', value: '3'}, {guesstimateType: 'POINT', value: 3}],
      [{guesstimateType: 'POINT', value: 3}, {guesstimateType: 'POINT', value: 3}],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.format(e[0])).to.deep.equal(e[1])
      })
    }).map(e => e())
  });
})
