var jStat = require('jstat').jStat;

export var Sampler = {
  sample({low, high}, n) {
    let results = []

    while (results.length < n) {
      results.push(jStat.uniform.sample(low, high))
    }

    return { values: results }
  }
}

