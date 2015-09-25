
let foo = {
  sample: {
    combine: function combine(samples) {
      let errors = [].concat.apply(samples[0].errors, samples[1].errors)
      let values = [].concat.apply(samples[0].values, samples[1].values)
      return {values, errors}
    }
  },
  simulation: {
    combine:  function combine(simulations) {
      return {
        metricId: simulations[0].metricId,
        sample: sample.combine(simulations.map(s => s.sample))
      }
    }
  }
}

export default Base
