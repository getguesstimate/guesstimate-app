import Metric from '../metric.js';
import {expect} from 'chai';

let defaultMetric = {
  id: 'WONSWER234',
  readableId: 'WON',
  name: 'Wondermen',
  valid: false,
  location: {row: 3, column: 1}
};

describe('Metric', () => {
  var metric;
  var defaults;

  describe('.create', () => {
    it('has value', () => {
      metric = new Metric({id: 'AS223', location: {row: 3, column:1}});
      let result = {
        id: 'AS223',
        readableId: 'AS2',
        name: '',
        valid: false,
        location: {row: 3, column: 1}
      };
      expect(metric.toStore()).to.deep.equal(result);
    });
  });

  describe('#set', () => {
    it('changes', () => {
      metric = new Metric(defaultMetric);
      metric.set({name: 'Superman'});
      expect(metric.toStore().name).to.equal('Superman');
    });
  });
});
