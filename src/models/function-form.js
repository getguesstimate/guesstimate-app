import math from 'mathjs';
import _ from 'lodash'

let metricId = (m) => { return m.readableId };
let metricMean = (m) => { return m.guesstimate.distribution.mean };

export function mGuesstimate(metric, guesstimates) {
  return guesstimates.find(g => g.metric === metric.id);
}

export function deNormalize(metrics, guesstimates) {
  return metrics.map( m => {
    return Object.assign({}, m, {guesstimate: mGuesstimate(m, guesstimates)});
  });
}

export function inputMetrics(str, metrics) {
  return metrics.filter((m) => { return str.includes(m.readableId); });
}

export function replaceReadableIdsWithMeans(str, metrics) {
  let tmpStr = str;
  let re = null;
  for (let metric of metrics) {
    re = new RegExp(metricId(metric), 'g');
    tmpStr = tmpStr.replace(re, metricMean(metric));
  }
  return tmpStr;
}

export default class FunctionForm{
  constructor(state, metrics = [], guesstimates = []){
    this.state = state;
    this.metrics = deNormalize(metrics, guesstimates);
  }
  isValid(){
    let isFunction = () => { return this.state[0] === '='; };
    let isParseable = () => { return this.calculate() !== false; };
    return (isFunction() && isParseable());
  }
  toGuesstimate(){
    return {funct: {textField: this.state}};
  }
  toDistribution(){
    return this.calculate();
  }
  calculate(){
    try {
      return this._calculate();
    } catch (exception) {
    return {mean: null, stdev: null, errors: [exception.message]};
    }
  }
  _calculate(){
    let shorten = (str) => { return str.substring(1, str.length); };
    let shortened = shorten(this.state);
    let replaced = replaceReadableIdsWithMeans(shortened, this._inputs());
    let correct = math.eval(replaced);
    return {mean: correct, stdev: 0};
  }
  _inputs(){
    return inputMetrics(this.state, this.metrics);
  }
}
