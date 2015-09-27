import {denormalize} from '../metric';
import {expect} from 'chai';

describe('metric', () => {
  let metric = null;
  let graph = null;
  let result = null;

  let guesstimates = [
    {metric: 'abc', name: 'what'},
    {metric: '324', name: 'silly'}
  ];

  let simulations = [
    {metric: '324', data: [2,3,54]},
    {metric: 'abc', data: [2,3,4]}
  ];

  describe.only('denormalize', () => {
    it('works with guesstimates and simulations', () => {
      metric = {id: 'abc'};
      graph = {metrics: [metric], guesstimates, simulations};
      result = denormalize(metric, graph);
      expect(result.guesstimate).to.deep.equal(guesstimates[0]);
      expect(result.simulation).to.deep.equal(simulations[1]);
    });
    it('works with only guesstimates', () => {
      metric = {id: 'abc'};
      graph = {metrics: [metric], guesstimates};
      result = denormalize(metric, graph);
      expect(result.guesstimate).to.deep.equal(guesstimates[0]);
    });
  });
});
