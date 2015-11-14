export var Sampler = {
  sample(formatted, n) {
    const {low, high} = formatted

    let samples = []
    for (let i = 0; i < n; i++) {
      const offset = (high - low)
      const newSample = (Math.random() * offset) + low
      samples = samples.concat(newSample)
    }

    return { values: samples }
  }
}

