/* @flow */

import _ from 'lodash'
import Stochator from 'stochator';
import * as functionDistribution from './functionDistribution.js';

type Distribution = {mean: number; stdev: number, input: string};
type DGraph = {metrics: any};
type Sample = {values?: Array<number>, errors?: Array<Object>};

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
  let stochator = new Stochator({
    mean: distribution.mean,
    stdev: distribution.stdev,
    seed: 0,
    min: 0
  });
  //This makes the outputs integers.  This could change, of course
  return { values: stochator.next(n).map(n => Math.floor(n)) }
}
