var GuesstimateForm = require('../guesstimate-form.js');
var expect = require('chai').expect;

describe('GuesstimateForm', () => {
  var guesstimateForm;
  const options = {value: 'foobar'};

  beforeEach(() => {
    guesstimateForm = new GuesstimateForm(options);
  });

  describe('#constructor', () => {
    it('has value', () => {
      expect(guesstimateForm.state.value).to.equal('foobar');
    });
  });
});
