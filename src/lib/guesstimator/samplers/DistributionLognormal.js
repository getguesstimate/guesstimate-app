var jStat = require('jstat').jStat;

export var Sampler = {
  sample(formatted, n) {
    // This assumes a 90% confidence interval
    logHigh = math.log(formatted.high)
    logLow = math.log(formatted.low)

    const mean = (logHigh + logLow)/2
    const stdev = (logHigh-logLow) / (2*1.645)

    let results = []

    while (results.length < n) {
      results.push(jStat.lognormal.sample(mean,stdev))
    }

    return { values: results.map(n => n) }
  }
}

