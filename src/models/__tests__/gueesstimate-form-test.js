var GuesstimateForm = require('../guesstimate-form.js');
var expect = require('chai').expect;

describe('GuesstimateForm', () => {
  var guesstimateForm;

  describe('#constructor', () => {
    it('has value', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      expect(guesstimateForm.state).to.equal('=34 + AID');
    });
  });
  describe('#isFunction', () => {
    it('with function', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      expect(guesstimateForm.isFunction()).to.equal(true);
    });
    it('with estimate', () => {
      guesstimateForm = new GuesstimateForm('1 -> 3');
      expect(guesstimateForm.isFunction()).to.equal(false);
    });
  });
  describe('#isEstimate', () => {
    it('with function', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      expect(guesstimateForm.isEstimate()).to.equal(false);
    });
    it('with estimate', () => {
      guesstimateForm = new GuesstimateForm('1/3');
      expect(guesstimateForm.isEstimate()).to.equal(true);
    });
  });
  describe('#toGuesstimate', () => {
    it('with function', () => {
      guesstimateForm = new GuesstimateForm('=34 + AID');
      expect(guesstimateForm.toGuesstimate()).to.deep.equal({funct: {textField: '=34 + AID'}});
    });
    it('with estimate', () => {
      guesstimateForm = new GuesstimateForm('1 / 3');
      expect(guesstimateForm.toGuesstimate()).to.deep.equal({estimate: {median: 1, stdev: 3}});
    });
  });
});
