import * as estimateInput from '../estimateInput.js';
import {expect} from 'chai';

describe('estimateInput', () => {
  let metric = null;
  let graph = null;
  let result = null;

  describe.only('#toDistribution', () => {
    let result = (input) => estimateInput.toDistribution(input);

    it('with /', () => {
      expect(result('5/2')).to.deep.equal({mean: 5, stdev: 2});
    });

    it('with +-', () => {
      expect(result('5+-2')).to.deep.equal({mean: 5, stdev: 2});
    });

    it('with ->', () => {
      console.log(result('1->5'))
      expect(result('1->5')).to.deep.equal({mean: 3, stdev: 2});
    });
  });
});
