import {Distribution} from './index';
import {expect} from 'chai';

describe.only('Distribution', () => {
  describe('#isA', () => {
    it('with point', () => {
      const foo = Distribution
      expect(Distribution.isA({input: '3'})).to.equal(true)
    })

    it('normal', () => {
      expect(Distribution.isA({input: '3->9'})).to.equal(true)
    })
  });

  describe('simulator', () => {
    it('with point', () => {
      expect(Distribution.simulator({input: '3'}).name).to.equal('point')
    })

    it('normal', () => {
      expect(Distribution.simulator({input: '3->9'}).name).to.equal('normal')
    })
  });
})
