import GuesstimateForm from '../guesstimate-form.js';
import {EstimateForm} from '../guesstimate-form.js';
import FunctionForm from '../function-form';
import {expect} from 'chai';

describe('GuesstimateForm', () => {
  var guesstimateForm;
  var guesstimate;
  var toJSON;

  describe('#constructor', () => {
    it('has value', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      expect(guesstimateForm.state).to.equal('=34 + AID');
    });
  });
  describe('#toJSON', () => {
    it('is correct', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      toJSON = {
        input: '=34 + AID',
        isValid: false,
        distribution: { mean: false, stdev: 0 }
      };
      expect(guesstimateForm.toJSON()).to.deep.equal(toJSON);
    });
  });
  describe('#isFunction', () => {
    it('with function', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      expect(guesstimateForm._isFunction()).to.equal(true);
    });
    it('with estimate', () => {
      guesstimateForm = new GuesstimateForm('1 -> 3');
      expect(guesstimateForm._isFunction()).to.equal(false);
    });
  });
  describe('#isEstimate', () => {
    it('with function', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      expect(guesstimateForm._isEstimate()).to.equal(false);
    });
    it('with estimate', () => {
      guesstimateForm = new GuesstimateForm('1/3');
      expect(guesstimateForm._isEstimate()).to.equal(true);
    });
  });
  describe('#toGuesstimate', () => {
    it('with function', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      guesstimate = guesstimateForm.guesstimate;
      expect(guesstimateForm.guesstimate).to.be.an.instanceof(FunctionForm);
    });
    it('with estimate', () => {
      guesstimateForm = new GuesstimateForm('1 / 3');
      expect(guesstimateForm.guesstimate).to.be.an.instanceof(EstimateForm);
    });
  });
});
