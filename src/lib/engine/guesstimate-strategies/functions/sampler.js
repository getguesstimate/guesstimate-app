export function sample(compiled, inputs, n){
  let samples = []
  for (let i = 0; i < n; i++) {
    const newSample = functionCalculate(compiled, inputs)
    if (_.isFinite(newSample)) {
      samples = samples.concat(newSample)
    } else {
      return [{values: samples, errors: ['Invalid sample']}]
    }
  }

  return {values: samples}
}

let metricSample = (m) =>  _.sample(m.simulation.sample.values);

export function inputToSample(metrics) {
  return _.zipObject(metrics.map(m => {return [m.readableId, metricSample(m)]}))
}

export function functionCalculate(parsed, inputs){
  const inputSamples = inputToSample(inputs)
  return parsed.eval(inputSamples)
}
