import {getStrategy} from './index.js';
import {expect} from 'chai';

describe('sample', () => {
  //describe('#sample', () => {
    //it('with point distribution', () => {
      //expect(sample({input: '4'}, {}, 5).values).to.deep.equal([4])

      //expect(sample({input: '4->1'}, {}, 5).values.length).to.equal(5)
      //expect(sample({input: '4->1'}, {}, 5).values.length).to.be.within(1, 8)
      //expect(sample({input: '=4'}, {}, 5).values).to.deep.equal([4,4,4,4,4])
      //expect(sample({input: '=4^3'}, {}, 3).values).to.deep.equal([64, 64, 64])
    //});
  //});

  describe('#getStrategy', () => {
    it('with point distribution', () => {
      expect(getStrategy({input: '4'}).name).to.equal('point')
      expect(getStrategy({input: '4->3'}).name).to.equal('normal')
      expect(getStrategy({input: '=3'}).name).to.equal('function')
    });
  });
})
