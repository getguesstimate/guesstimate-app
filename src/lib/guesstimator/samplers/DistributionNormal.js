import math from 'mathjs';
var jStat = require('jstat').jStat;

export var Sampler = {
  sample({high, low}, n) {
    // This assumes a 90% confidence interval, distributed symmetrically.
    const mean = math.mean(high, low)
    const stdev = (high - mean) / 1.645

    let results = []
    while (results.length < n) {
      results.push(jStat.normal.sample(mean, stdev))
    }

    return { values: results }
  }
}

