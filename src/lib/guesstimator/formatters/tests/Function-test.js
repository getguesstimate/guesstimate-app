import {item as formatter} from '../Function.js'

describe("Function", () => {
  describe('#matches', () => {
    const examples = [
      [{text: '3'}, false],
      [{text: '=3'}, true],
    ]

    examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.matches(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe.only('#format', () => {
    const defaultGraph = {
      metrics: [
        {readableId:'AB', simulations: {sample: {values: [3,4,5]}}},
        {readableId:'CI', simulations: {sample: {values: [3,4,5]}}}
      ]
    }

    const examples = [
      [{text: '=43', graph: {}}, {guesstimateType: 'FUNCTION', text: '43', inputs:{}}],
      [{ text: '=43+AB', graph: defaultGraph }, {guesstimateType: 'FUNCTION', text: '43+AB', inputs:{AB: [3,4,5]}}],
    ]

    examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        const formatted = formatter.format(e[0])
        expect(formatted.inputs).to.deep.equal(e[1].inputs)
        expect(formatted.guesstimateType).to.equal(e[1].guesstimateType)
        expect(formatted.text).to.equal(e[1].text)
      })
    }).map(e => e())
  });
})
