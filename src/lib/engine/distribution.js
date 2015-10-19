/* @flow */

import _ from 'lodash'
import Stochator from 'stochator';
import * as functionDistribution from './functionDistribution.js';
import type {Distribution, DGraph, Sample} from './types.js'

export function sample(distribution: Distribution, dGraph: DGraph, n: number = 1): Sample {
  if (isNormal(distribution)){
    return sampleNormal(distribution, n)
  } else {
    let values = functionDistribution.sample(distribution, dGraph, n);
    return values;
  }
}

function isNormal(distribution: Distribution): boolean{
  return (!_.isUndefined(distribution.mean) && !_.isUndefined(distribution.stdev));
}

function sampleNormal(distribution: Distribution, n: number = 1){
  const stochator = new Stochator({
    mean: distribution.mean,
    stdev: distribution.stdev,
    seed: 0,
    min: -99999999999999
  });
  //This makes the outputs integers.  This could change, of course
  let results = stochator.next(n)
  results = Array.isArray(results) ? results : [results]
  return { values: results.map(n => n) }
}
