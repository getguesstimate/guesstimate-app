export function simulate(expr, inputs, overallNumSamples) {
  const numSamples = overallNumSamples/window.workers.length
  return Promise.all(_.map(
    window.workers,
    (worker, index) => simulateOnWorker(worker, buildData(index, expr, numSamples, inputs))
  )).then(
    (results) => {
      let finalResult = {values: [], errors: []}
      for (let result of results) {
        if (result.values) {
          finalResult.values = finalResult.values.concat(result.values)
        }
        if (result.errors) {
          finalResult.errors = finalResult.errors.concat(result.errors)
        }
      }
      finalResult.errors = _.uniq(finalResult.errors)
      return finalResult
    }
  )
}

function buildData(index, expr, numSamples, inputs) {
  let slicedInputs = {}
  for (let key of Object.keys(inputs)) {
    slicedInputs[key] = inputs[key].slice(numSamples*index, numSamples*(index+1))
  }
  return {expr, numSamples, inputs: slicedInputs}
}

function simulateOnWorker(worker, data) {
  return new Promise(
    (resolve, reject) => {
      worker.push(data, ({data}) => {resolve(JSON.parse(data))})
    }
  )
}
