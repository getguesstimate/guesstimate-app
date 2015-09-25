import _ from 'lodash';
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

export function inputMetricsReady(metrics){
  return _.every(metrics, (m) => !_.isUndefined(m.simulation));
}

export function calculate(functionInput, dGraph){
  let inputs = inputMetrics(functionInput, dGraph);
  if (inputMetricsReady(inputs)) {
    let shorten = (str) => { return str.substring(1, str.length); };
    let shortened = shorten(functionInput);
    let replaced = replaceReadableIdsWithSamples(shortened, inputs);
    let correct = math.eval(replaced);
    return {values: correct};
  } else {
    return {errors: ['Inputs do not have samples yet!']};
  }
}

