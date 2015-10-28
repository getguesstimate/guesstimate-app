import {sample, isNormal, isFunction, isSingleValue, sampleNormal}  from '../distribution.js';
import {expect} from 'chai';

describe('distribution', () => {
  describe('#isNormal', () => {
    const makeTest = (input, output) => {
      it(`works with ${JSON.stringify(input)}`, () => {
        expect(isNormal(input)).to.equal(output);
      });
    }

    makeTest({mean: 3, stdev: 2}, true)
    makeTest({mean: 3.3, stdev: 2.83838}, true)

    makeTest({mean: 3, stdev: null}, false)
    makeTest({mean: null, stdev: 3}, false)
    makeTest({mean: null, stdev: null}, false)
    makeTest({mean: null, stdev: null}, false)
    makeTest({mean: undefined, stdev: undefined}, false)
    makeTest({mean: '3', stdev: 2}, false)
    makeTest({foo: 'bar'}, false)
  });

  describe('#isFunction', () => {
    const makeTest = (input, output) => {
      it(`works with ${JSON.stringify(input)}`, () => {
        expect(isFunction(input)).to.equal(output);
      });
    }

    makeTest({input: '=bar'}, true)
    makeTest({input: '= bar'}, true)
    makeTest({input: '= 23 + 23'}, true)

    makeTest({input: '3'}, false)
    makeTest({input: ''}, false)
    makeTest({foo: 'bar'}, false)
    makeTest({input: 334}, false)
  });

  describe('#isSingleValue', () => {
    const makeTest = (input, output) => {
      it(`works with ${JSON.stringify(input)}`, () => {
        expect(isSingleValue(input)).to.equal(output);
      });
    }

    makeTest({value: 3}, true)
    makeTest({value: 3.3}, true)

    makeTest({value: ''}, false)
    makeTest({value: '3'}, false)

    makeTest({input: '=bar'}, false)
    makeTest({input: '= bar'}, false)
  });
});
