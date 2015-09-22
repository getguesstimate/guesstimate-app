import FunctionForm from '../function-form';
import {replaceReadableIdsWithMeans} from '../function-form';

var expect = require('chai').expect;

describe('FunctionForm', () => {
  var functionForm;
  let metrics = [
     {
      id: 'wer9o8jwer8jwer',
      readableId: 'ABC',
      isValid: false,
      guesstimate: {
        input: '',
        distribution: {mean: 1, stdev: 2}
      }
     },
     {
      id: 'sdfsdf89j',
      readableId: 'XYZ',
      isValid: false,
      guesstimate: {
        input: '',
        distribution: {mean: 5, stdev: 2}
      }
     }
  ];

  describe('#isValid', () => {
    it('with valid input', () => {
      functionForm = new FunctionForm('= 34 + 3');
      expect(functionForm.isValid()).to.equal(true);
    });
    it('with invalid input', () => {
      functionForm = new FunctionForm('==* 34 + 3');
      expect(functionForm.isValid()).to.equal(false);
    });
  });

  describe('#calculate', () => {
    it('with no inputs', () => {
      functionForm = new FunctionForm('= 34 + 3');
      expect(functionForm.calculate()).to.equal(37);
    });
    it('with one input', () => {
      functionForm = new FunctionForm('= ABC + 1', metrics);
      expect(functionForm.calculate()).to.equal(2);
    });
    it('with two inputs', () => {
      functionForm = new FunctionForm('= ABC + XYZ', metrics);
      expect(functionForm.calculate()).to.equal(6);
    });
    it('with an invalid input', () => {
      functionForm = new FunctionForm('=sl*23/*', metrics);
      expect(functionForm.calculate()).to.equal(false);
    });
  });

  describe('_inputs', () => {
    it('finds input', () => {
      functionForm = new FunctionForm('= ABC', metrics);
      expect(functionForm._inputs()).to.deep.equal([metrics[0]]);
    });
  });

  describe('#replaceReadableIdsWithMeans', () => {
    it('evaluates', () => {
      let result = replaceReadableIdsWithMeans('= ABC', metrics);
      expect(result).to.equal('= 1');
    });
  });
});

