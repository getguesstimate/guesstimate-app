import math from 'mathjs';
var jStat = require('jstat').jStat;

export var Sampler = {
  sample(formatted, n) {
    // This assumes a centered 90% confidence interval, e.g. the left endpoint
    // marks 0.05% on the CDF, the right 0.95%.
    const logHigh = math.log(formatted.high)
    const logLow = math.log(formatted.low)

    const mean = (logHigh + logLow)/2
    const stdev = (logHigh-logLow) / (2*1.645)

    const getSample = () => jStat.lognormal.sample(mean, stdev)
    let results = Array.apply(null, {length: n}).map( getSample)

    results = Array.isArray(results) ? results : [results]

    return { values: results.map(n => n) }
  }
}

