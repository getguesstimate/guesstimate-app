import {Evaluate} from './simulator/evaluator.js'

import {orArr} from 'gEngine/utils'

import * as constants from 'lib/propagation/constants'

// TODO(matthew): fix error messages

const {
  ERROR_TYPES: {WORKER_ERROR},
  ERROR_SUBTYPES: {
    WORKER_ERROR_SUBTYPES: {
      NO_DATA_PASSED_ERROR,
      NO_EXPR_PASSED_ERROR,
      NO_NUMSAMPLES_PASSED_ERROR,
      ZERO_SAMPLES_REQUESTED_ERROR,
    }
  }
} = constants

onmessage = ({data}) => {
  let errors = []
  if (!data) {
    errors.push({type: WORKER_ERROR, subType: NO_DATA_PASSED_ERROR, message: 'data required'})
    postMessage(JSON.stringify({errors}))
    return
  }

  data = JSON.parse(data)

  if (!data.expr) {
    errors.push({type: WORKER_ERROR, subType: NO_EXPR_PASSED_ERROR, message: 'data.expr required'})
  }
  if (!data.numSamples) {
    if (data.numSamples === 0) {
      errors.push({type: WORKER_ERROR, subType: ZERO_SAMPLES_REQUESTED_ERROR, message: '0 is not a valid number of samples'})
    } else {
      errors.push({type: WORKER_ERROR, subType: NO_NUMSAMPLES_PASSED_ERROR, message: 'data.numSamples required'})
    }
  }

  if (!_.isEmpty(errors)) {
    postMessage(JSON.stringify({errors}))
  } else {
    postMessage(JSON.stringify(Evaluate(data.expr, data.numSamples, orArr(data.inputs))))
  }
}
