import math from 'mathjs';
import {inputMetrics} from './lib'

let metricSample = (m) =>  _.sample(m.simulation.sample.values);
let metricId = (m) => { return m.readableId; };

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

export function compile(functionInput, dGraph){
  const shortened = shorten(functionInput);
  const inputs = inputMetrics(functionInput, dGraph);

  if (!inputMetricsReady(inputs)) { return [{errors: ['Inputs do not have samples yet!']}]} ;

  const compiled = math.compile(shortened)
  return {inputs, compiled}
}
