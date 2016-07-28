import {item as formatter} from '../DistributionTextUpTo.js'

describe('DistributionTextUpTo', () => {
  describe('#matches', () => {
    const examples = [
      [{text: '8->10'}, true],
      [{text: '8:10'}, true],
      [{text: '8:10', guesstimateType: 'NORMAL'}, true],
      [{text: '8:10', guesstimateType: 'UNIFORM'}, true],
      [{text: ' 8 :10'}, true],
      [{text: '8:'}, false],
      [{text: '8'}, false],
    ]

    examples.map(e => () => {
      it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
        expect(formatter.matches(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#format', () => {
    const examples = [
      [{text: '8:10'}, {guesstimateType: 'LOGNORMAL', params: [8, 10]}],
      [{text: '0:5'}, {guesstimateType: 'NORMAL', params: [0, 5]}],
      [{text: '8:10', guesstimateType: 'UNIFORM'}, {guesstimateType: 'UNIFORM', params: [8, 10]}],
      [{text: '8K:10M', guesstimateType: 'NORMAL'}, {guesstimateType: 'NORMAL', params: [8000, 10000000]}],
      [{text: '-5:5', guesstimateType: 'NORMAL'}, {guesstimateType: 'NORMAL', params: [-5, 5]}],
      [{text: '0:5', guesstimateType: 'NORMAL'}, {guesstimateType: 'NORMAL', params: [0, 5]}],
    ]

    examples.map(e => () => {
      it(`guesstimate ${JSON.stringify(e[0])} converts to ${JSON.stringify(e[1])}`, () => {
        expect(formatter.format(e[0])).to.deep.equal(e[1])
      })
    }).map(e => e())
  });

  describe('#errors', () => {
    const examples = [
      [{text: '8->10', guesstimateType: 'NORMAL'}, false],
      [{text: '8->7', guesstimateType: 'NORMAL'}, true],
    ]

    examples.map(e => () => {
      it(`guesstimate ${JSON.stringify(e[0])} has errors ${JSON.stringify(e[1])}`, () => {
        expect(!_.isEmpty(formatter.error(e[0])).to.equal(e[1])
      })
    }).map(e => e())
  });
})
