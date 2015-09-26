import _ from 'lodash'
import Stochator from 'stochator';
import * as functionDistribution from './functionDistribution.js';

export function sample(guesstimate, dGraph, n=1){
  let values = dsample(guesstimate.distribution, dGraph, n)
  let foo = {
    metric: guesstimate.metric,
    sample: {
      values: values.values,
      errors: []
    }
  };
  return foo
}

function isNormal(distribution){
  return (!_.isUndefined(distribution.mean) && !_.isUndefined(distribution.stdev));
}

function dsample(distribution, dGraph, n=1){
  if (isNormal(distribution)){
    return sampleNormal(distribution, n)
  } else {
    let values = functionDistribution.sample(distribution, dGraph, n);
    return values;
  }
}

function sampleNormal(distribution, n=1){
    let stochator = new Stochator({
      mean: distribution.mean,
      stdev: distribution.stdev,
      seed: 0,
      min: 0
    });
    let now = new Date
    let values = stochator.next(n).map(n => Math.floor(n));
    //console.log('generating', (new Date) - now)
    //console.log(values)
    return {
      values
    }

}
