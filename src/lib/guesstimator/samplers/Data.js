export var Sampler = {
  sample(formatted, n) {
    const {data} = formatted
    const values = _.range(n).map(e => _.sample(data))
    return Promise.resolve({values})
  }
}

