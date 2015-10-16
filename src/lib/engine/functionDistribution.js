import math from 'mathjs';
import _ from 'lodash';
import * as functionInput from './functionInput';
import * as dsample from './sample';

export function sample(functionDistribution, dGraph, n){
    let samples = calculate(functionDistribution, dGraph, n);
    samples = dsample.combine(samples);
    samples.values = samples.values.filter(v => !_.isUndefined(v));
    return samples;
}

export function calculate(functionDistribution, dGraph, n) {
  let value = null;
  try {
    return functionInput.sample(functionDistribution.input, dGraph, n);
  } catch (exception) {
    return [{errors: [exception.message]}];
  }
}
