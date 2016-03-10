import {jStat} from 'jstat'

export var Sampler = {
  sample(formatted, n) {
    const mean = (formatted.high - formatted.low)/2 + formatted.low

    // This assumes a 90% confidence interval
    const stdev = (formatted.high - mean) / 1.645
    let inputs = {mean, stdev}

    if (inputs.mean === 0) {
      inputs.mean = Math.pow(10, -100)
    }

    const getSample = () => jStat.normal.sample(mean, stdev)
    let results = Array.apply(null, {length: n}).map( getSample)

    results = Array.isArray(results) ? results : [results]

    return { values: results.map(n => n) }
  }
}

