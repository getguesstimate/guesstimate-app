// <reference path='../../../typings/tsd.d.ts'/>
import reducer from '../simulations-reducer';
import {expect} from 'chai';

let defaultSimulations = [{
    metricId: '123',
    sample: {
      values: [1,2],
      errors: []
    }
  }
];

describe('simulations reducer', () => {
  var action;
  var newSim;
  var result;

  describe('UPDATE_SIMULATION', () => {
    describe('For an existing simulation', () => {
      it('adds samples', () => {
        newSim = {metricId: '123', sample: {values: [3], errors: []}};
        action = {type: 'UPDATE_SIMULATION', simulation: newSim};

        result = reducer(defaultSimulations, action);
        expect(result.length).to.equal(1);
        expect(result[0].sample.values).to.deep.equal([1,2,3]);
      });
    });

    describe('For an new simulation', () => {
      it('saves a new simulation', () => {
        newSim = {metricId: '987', sample: {values: [3], errors: []}};
        action = {type: 'UPDATE_SIMULATION', simulation: newSim};
        result = reducer(defaultSimulations, action);
        expect(result.length).to.equal(2);
        expect(result[0].sample.values).to.deep.equal([1,2]);
        expect(result[1].sample.values).to.deep.equal([3]);
      });
    });
  });
});
