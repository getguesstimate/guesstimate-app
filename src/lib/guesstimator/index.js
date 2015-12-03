import {format, errors, preFormatGuesstimate} from './formatter/index.js'
import {find} from './types.js'

export {inputMetrics, format} from './formatter/index.js'
export {types} from './types.js'
export {find} from './types.js'

export function sampleFromGuesstimateApp(guesstimate, dGraph, n) {
  let newGuesstimate = preFormatGuesstimate(guesstimate, dGraph)

  const formattedInput = format(newGuesstimate)
  const formatterErrors = errors(newGuesstimate)

  let _sample = null

  if (formattedInput.guesstimateType === 'NONE') {
    _sample = {errors: ['Invalid input']}
  } else if (formatterErrors.length){
    _sample = {errors: formatterErrors}
  } else {
    _sample = sample(formattedInput, n)
  }

  return {
    metric: guesstimate.metric,
    sample: _sample
  }
}

export function sample(input, n) {
  const guesstimateType = find(input.guesstimateType)
  if (guesstimateType && guesstimateType.sampler) {
    return guesstimateType.sampler.sample(input, n)
  } else {
    return {errors: ['No Valid Sampler']}
  }
}
