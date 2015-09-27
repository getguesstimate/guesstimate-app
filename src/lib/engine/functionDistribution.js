import math from 'mathjs';
import _ from 'lodash';
import * as functionInput from './functionInput';
import * as dsample from './sample';

export function sample(functionDistribution, dGraph, n){
    let samples = Array.apply(null, {length: n}).map(n => calculate(functionDistribution, dGraph));
    samples = dsample.combine(samples);
    samples.values = samples.values.filter(v => !_.isUndefined(v));
    return samples;
}

export function calculate(functionDistribution, dGraph, n) {
  let value = null;
  try {
    return functionInput.calculate(functionDistribution.input, dGraph);
  } catch (exception) {
    return {errors: [exception.message]};
  }
}
