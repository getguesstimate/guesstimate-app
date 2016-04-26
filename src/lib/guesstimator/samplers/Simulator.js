export const simulate = (expr, inputs, numSamples) => {
  const data = {expr, numSamples: numSamples/window.workers.length, inputs}
  return Promise.all(window.workers.map(worker => simulateOnWorker(worker, data))).then(
    (results) => {
      let finalResult = {values: [], errors: []}
      for (let result of results) {
        finalResult.values = finalResult.values.concat(result.values)
        finalResult.errors = _.uniq(finalResult.errors.concat(result.errors))
      }
      return finalResult
    }
  )
}

const simulateOnWorker = (worker, data) => {
  return new Promise(
    (resolve, reject) => {
      worker.push(data, ({data}) => {resolve(JSON.parse(data))})
    }
  )
}