import {item as formatter} from '../DistributionPointText.js'

describe("DistributionPointText", () => {
  describe('#matches', () => {
    const examples = [
      [{text: '3'}, true],
      [{value: '3'}, false],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        const foo = formatter
        expect(formatter.matches(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#format', () => {
    const examples = [
      [{text: '3'}, {guesstimateType: 'POINT', params: [3]}],
      [{text: '3K'}, {guesstimateType: 'POINT', params: [3000]}],
    ]

    const itExamples = examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.format(e[0])).to.deep.equal(e[1])
      })
    }).map(e => e())
  });
})
