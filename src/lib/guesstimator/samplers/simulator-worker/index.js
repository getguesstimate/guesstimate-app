import {Evaluate} from './simulator/evaluator.js'
import {INTERNAL_ERROR} from 'lib/errors/modelErrors'

onmessage = ({data}) => {
  let errors = []
  if (!data) {
    errors.push({type: INTERNAL_ERROR, message: "data required"})
    postMessage(JSON.stringify({errors}))
    return
  }

  data = JSON.parse(data)

  if (!data.expr) {
    errors.push({type: INTERNAL_ERROR, message: "data.expr required"})
  }
  if (!data.numSamples) {
    errors.push({type: INTERNAL_ERROR, message: "data.numSamples required"})
  }

  if (errors.length > 0) {
    postMessage(JSON.stringify({errors}))
    return
  }

  postMessage(JSON.stringify(Evaluate(data.expr, data.numSamples, !!data.inputs ? data.inputs : [])))
}
