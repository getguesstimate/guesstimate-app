/* @flow */

import _ from 'lodash'
import Stochator from 'stochator';
import * as functionDistribution from './functionDistribution.js';
import type {Distribution, DGraph, Sample} from './types.js'

export function sample(distribution: Distribution, dGraph: DGraph, n: number = 1): Sample {
  if (isNormal(distribution)){
    return sampleNormal(distribution, n)
  } else if (isFunction(distribution)){
    console.log('isFunction')
    let values = functionDistribution.sample(distribution, dGraph, n);
    return values;
  } else {
    return {errors:['Empty']}
  }
}

export function isNormal(distribution: Distribution): boolean{
  return (_.isNumber(distribution.mean) && _.isNumber(distribution.stdev));
}

export function isFunction(distribution: Distribution): boolean{
  const {input} = distribution;
  return (_.isString(input) && (input !== '') && (input[0] === '='));
}

export function sampleNormal(distribution: Distribution, n: number = 1){
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
