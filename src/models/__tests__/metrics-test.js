import Metrics from '../metrics.js';
import {expect} from 'chai';

let defaultMetrics = [
  {
    id: 'ABC123',
    readableId: 'ABC',
    name: 'Wondermen',
    valid: true,
    location: {row: 3, column: 1}
  },
  {
    id: 'XYZ123',
    readableId: 'XYZ',
    name: 'Wondermen',
    valid: false,
    location: {row: 3, column: 1}
  },
];

describe('Metrics', () => {
  var metrics;
  var defaults;

  describe('remove', () => {
    it('removes', () => {
      metrics = new Metrics(defaultMetrics);
      expect(metrics.state.length).to.equal(2);
      metrics.remove('ABC123');
      expect(metrics.state.length).to.equal(1);
    });
  });

  describe('get', () => {
    it('gets', () => {
      metrics = new Metrics(defaultMetrics);
      expect(metrics.get('ABC123')).to.deep.equal(defaultMetrics[0]);
    });
  });

  describe('add', () => {
    it('adds', () => {
      metrics = new Metrics(defaultMetrics);
      let newMetric = metrics.add({id: 'CDX235'});
      expect(metrics.state.length).to.equal(3);
      expect(metrics.get('CDX235').id).to.equal('CDX235');
    });
  });

  describe('change', () => {
    it('change', () => {
      metrics = new Metrics(defaultMetrics);
      expect(metrics.get('ABC123').name).to.equal('Wondermen');
      metrics.change('ABC123', {name: 'Foobar'});
      expect(metrics.get('ABC123').name).to.equal('Foobar');
    });
  });
});
