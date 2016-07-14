export var Sampler = {
  sample({params: [value]}) {
    return Promise.resolve({values: [value]})
  }
}
