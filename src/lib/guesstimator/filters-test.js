import {inRange} from './filters.js';
import {expect} from 'chai';

describe('inRange', () => {
  it('works', () => {
    expect(inRange([3, 8, 18, 12], {min: 5, max: 15})).to.deep.equal([8, 12])
    expect(inRange([3, 8, 18, 12], {min: 5})).to.deep.equal([8, 18, 12])
    expect(inRange([3, 8, 18, 12], {})).to.deep.equal([3, 8, 18, 12])
  });
})
