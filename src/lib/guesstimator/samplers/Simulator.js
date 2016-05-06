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

function modularSlice(array, from, to) {
  const len = array.length
  if (len <= to - from) {
    return array
  }
  const [newFrom, newTo] = [from % len, to % len]
  if (newTo > newFrom) {
    return array.slice(newFrom, newTo)
  }
  return [...array.slice(newFrom), array.slice(0,to)]
}

function buildData(index, expr, numSamples, inputs) {
  let slicedInputs = {}
  for (let key of Object.keys(inputs)) {
    slicedInputs[key] = modularSlice(inputs[key], numSamples*index, numSamples*(index+1))
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
