import _ from 'lodash'
import Stochator from 'stochator';
import * as functionDistribution from './functionDistribution.js';

export function sample(distribution, dGraph, n=1){
  if (isNormal(distribution)){
    return sampleNormal(distribution, n)
  } else {
    let values = functionDistribution.sample(distribution, dGraph, n);
    return values;
  }
}

function isNormal(distribution){
  return (!_.isUndefined(distribution.mean) && !_.isUndefined(distribution.stdev));
}

function sampleNormal(distribution, n=1){
    let stochator = new Stochator({
      mean: distribution.mean,
      stdev: distribution.stdev,
      seed: 0,
      min: 0
    });
    //This makes the outputs integers.  This could change, of course
    return { values: stochator.next(n).map(n => Math.floor(n)) }
}
