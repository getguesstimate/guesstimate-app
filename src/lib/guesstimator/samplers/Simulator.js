import Worker from 'worker!./simulator-worker/index.js'
const workers = [new Worker, new Worker, new Worker, new Worker]

export const simulate = (expr, inputs, numSamples) => {
  const data = {expr, numSamples: numSamples/4, inputs}
  return Promise.all(workers.map(worker => simulateOnWorker(worker, data))).then(
    (results) => {
      let finalResult = {values: [], errors: []}
      for (let result of results) {
        finalResult.values = finalResult.values.concat(result.values)
        finalResult.errors = finalResult.errors.concat(result.errors)
      }
      return finalResult
    }
  )
}

const simulateOnWorker = (worker, data) => {
  return new Promise(
    (resolve, reject) => {
      worker.onmessage = ({data}) => {resolve(JSON.parse(data))}
      worker.postMessage(JSON.stringify(data))
    }
  )
}
