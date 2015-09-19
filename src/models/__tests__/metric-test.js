import Metric from '../metric.js';
import {expect} from 'chai';

let defaultMetric = {
  id: 32,
  readableId: 'WON',
  name: 'Wondermen',
  isValid: false,
  guesstimate: {
    input: '32/2',
    distribution: {mean: 32, stdev: 2}
  },
  location: {row: 3, column: 1}
};

describe('Metric', () => {
  var metric;
  var defaults;

  describe('.create', () => {
    it('has value', () => {
      metric = Metric.create(32, {row: 3, column:1});
      let result = {
        id: 32,
        readableId: '',
        name: '',
        isValid: false,
        guesstimate: {
          input: '',
          distribution: {}
        },
        location: {row: 3, column: 1}
      };
      expect(metric.state).to.deep.equal(result);
    });
  });
  describe('#changeName', () => {
    it('with existing readableId', () => {
      metric = new Metric(defaultMetric);
      metric.changeName('Superman');
      expect(metric.state.name).to.equal('Superman');
      expect(metric.state.readableId).to.equal('WON');
    });

    it('without existing readableId', () => {
      defaults = Object.assign({}, defaultMetric, {readableId: ''});
      metric = new Metric(defaults);
      metric.changeName('Superman');
      expect(metric.state.name).to.equal('Superman');
      expect(metric.state.readableId).to.equal('SUP');
    });
  });
  describe('#changeGuesstimateInput', () => {
    it('with simple', () => {
      metric = new Metric(defaultMetric);
      metric.changeGuesstimateInput('12/4');
      expect(metric.state.guesstimate.input).to.equal('12/4');
      expect(metric.state.guesstimate.distribution).to.deep.equal({mean: 12, stdev: 4});
    });
  });
});
