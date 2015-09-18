import math from 'mathjs';

let metricId = (m) => { return m.readableId };
let metricMean = (m) => { return m.guesstimate.distribution.mean };

export function replaceReadableIdsWithMeans(str, metrics) {
  let tmpStr = str;
  for (let metric of metrics) {
    tmpStr = tmpStr.replace(metricId(metric), metricMean(metric));
    //console.log(tmpStr, metricId(metric), metricMean(metric))
  }
  return tmpStr;
}

export default class FunctionForm{
  constructor(state, metrics = []){
    this.state = state;
    this.metrics = metrics;
  }
  isValid(){
    // Are its inputs real inputs?
    return (this.state[0] === '=');
  }
  toGuesstimate(){
    return {funct: {textField: this.state}};
  }
  calculate(){
    let shorten = (str) => { return str.substring(1, str.length); };
    let shortened = shorten(this.state);
    let replaced = replaceReadableIdsWithMeans(shortened, this.metrics);
    let correct = math.eval(replaced);
    return correct;
  }
  inputs(){
    return this.metrics.filter((e) => { return this.state.includes(e.readableId)});
  }
}
