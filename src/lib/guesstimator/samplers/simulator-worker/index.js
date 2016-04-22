import {Evaluate} from './simulator/evaluator.js'

console.log("Worker spinning up.")

onmessage = event => {
  var data = event.data

  var errors = []
  if (!data) {
    errors.push("data required")
    postMessage(JSON.stringify({errors}))
    return
  }

  data = JSON.parse(data)

  if (!data.expr) {
    errors.push("data.expr required")
  }
  if (!data.numSamples) {
    errors.push("data.numSamples required")
  }

  if (errors.length > 0) {
    postMessage(JSON.stringify({errors: errors}))
    return
  }

  postMessage(JSON.stringify(Evaluate(data.expr, data.numSamples, !!data.inputs ? data.inputs : [])))
}
