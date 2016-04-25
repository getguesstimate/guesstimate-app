export var Sampler = {
  sample(formatted) {
    return Promise.resolve({values: [formatted.value]})
  }
}
