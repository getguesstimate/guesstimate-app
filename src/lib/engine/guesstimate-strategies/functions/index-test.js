import {Funct} from './index';
import {expect} from 'chai';

describe('functionStrategy', () => {
  describe('#inputMetrics', () => {
    it('without inputs', () => {
      const guesstimate = {input: '=34'}
      const dGraph = {metrics: []}
      expect(Funct.inputMetrics(guesstimate, dGraph)).to.deep.equal([])
    })

    it('without unimportant inputs', () => {
      const guesstimate = {input: '=34'}
      const dGraph = {metrics: [{readableId: 'EA'}]}
      expect(Funct.inputMetrics(guesstimate, dGraph)).to.deep.equal([])
    })

    it('with relevant inputs', () => {
      const guesstimate = {input: '=34*EA'}
      const dGraph = {metrics: [{readableId: 'EA'}]}
      expect(Funct.inputMetrics(guesstimate, dGraph)[0].readableId).to.deep.equal('EA')
    })
  });
})
