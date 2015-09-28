import * as eDistribution from './distribution.js';
import * as functionInput from './functionInput.js';
import * as estimateInput from './estimateInput.js';

function toDistribution(guesstimate) {
  let {input} = guesstimate;
  if (isFunc(input)){
    return functionInput.toDistribution(input)
  } else if (isEstimate(input)){
    return estimateInput.toDistribution(input)
  }
}

function isFunc(input){
  return (input[0] === '=');
}

function isEstimate(input){
  return (!isFunc(input));
}

//This obviously could use some clean up.
export function sample(guesstimate, dGraph, n=1){
  let _distribution = toDistribution(guesstimate)
  let values = eDistribution.sample(_distribution, dGraph, n)
  return {
    metric: guesstimate.metric,
    sample: {
      values: values.values,
      errors: []
    }
  };
}
