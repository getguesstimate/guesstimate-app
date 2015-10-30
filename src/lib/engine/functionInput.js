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

//{values: [], errors: []}
export function sample(functionInput, dGraph, n){
  const shortened = shorten(functionInput);
  const inputs = inputMetrics(functionInput, dGraph);

  if (!inputMetricsReady(inputs)) { return [{errors: ['Inputs do not have samples yet!']}]} ;

  const parsed = math.compile(shortened)
  let samples = []

  for (let i = 0; i < n; i++) {
    const newSample = newFunctionCalculate(parsed, inputs)
    if (_.isFinite(newSample)) {
      samples = samples.concat(newSample)
    } else {
      return [{errors: ['Invalid sample']}]
    }
  }

  return [{values: samples}]
}

export function newFunctionCalculate(parsed, inputs){
  const inputSamples = inputToSample(inputs)
  return parsed.eval(inputSamples)
}

export function toDistribution(functionInput){
  return {input: functionInput}
}
