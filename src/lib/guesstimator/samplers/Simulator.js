import Worker from 'worker!./simulator-worker/index.js'
const worker = new Worker

export const simulate = (expr, inputs, numSamples) => {
  return new Promise(
    (resolve, reject) => {
      worker.onmessage = ({data}) => resolve(JSON.parse(data))
      worker.postMessage(JSON.stringify({
        expr,
        numSamples,
        inputs
      }))
    }
  )
}
