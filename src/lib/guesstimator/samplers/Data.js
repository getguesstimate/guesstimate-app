export var Sampler = {
  sample(formatted, n) {
    const data = formatted.value
    const values = _.range(n).map(e => _.sample(data))
    return { values }
  }
}

