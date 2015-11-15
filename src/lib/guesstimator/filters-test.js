import {withPrecision, inRange} from './filters.js';
import {expect} from 'chai';

describe('withPrecision', () => {
  it('works', () => {
    expect(withPrecision([10.02, 3.84], '0.01')).to.deep.equal([10.02, 3.84])
    expect(withPrecision([10.02, 3.84], '0.1')).to.deep.equal([10.0, 3.8])
    expect(withPrecision([10.02, 3.84], '1')).to.deep.equal([10, 3])
  });
})

describe.only('inRange', () => {
  it('works', () => {
    expect(inRange([3, 8, 18, 12], {min: 5, max: 15})).to.deep.equal([8, 12])
    expect(inRange([3, 8, 18, 12], {min: 5})).to.deep.equal([8, 18, 12])
    expect(inRange([3, 8, 18, 12], {})).to.deep.equal([3, 8, 18, 12])
  });
})
