import math from 'mathjs';

let metricSample = (m) =>  _.sample(m.simulation.sample.values);
let metricId = (m) => { return m.readableId; };

export function inputMetrics(functionInput, dGraph) {
  return dGraph.metrics.filter((m) => { return functionInput.includes(m.readableId); });
}

export function replaceReadableIdsWithSamples(str, metrics) {
  let tmpStr = str;
  let re = null;
  for (let metric of metrics) {
    re = new RegExp(metricId(metric), 'g');
    tmpStr = tmpStr.replace(re, metricSample(metric));
  }
  return tmpStr;
}

export function inputToSample(metrics) {
  return _.zipObject(metrics.map(m => {return [m.readableId, metricSample(m)]}))
}

//should move somewhere else...
export function inputMetricsReady(metrics){
  return _.every(metrics, (m) => !_.isUndefined(m.simulation));
}

const shorten = (str) => { return str.substring(1, str.length); };

export function sample(functionInput, dGraph, n){
  const shortened = shorten(functionInput);
  const inputs = inputMetrics(functionInput, dGraph);
  if (inputMetricsReady(inputs)) {
    const parsed = math.compile(shortened)
    const results = Array(n).fill(null).map(n => newFunctionCalculate(parsed, inputs))
    return results
  } else {
    return [{errors: ['Inputs do not have samples yet!']}];
  }
}

export function newFunctionCalculate(parsed, inputs){
  let returnn = inputToSample(inputs)
  return {values: parsed.eval(returnn)};
}

export function toDistribution(functionInput){
  return {input: functionInput}
}
