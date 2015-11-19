export {format, errors} from './formatter/index.js'
export {types} from './types.js'
import {find} from './types.js'
export {find} from './types.js'

export function sample(input, n) {
  const guesstimateType = find(input.guesstimateType)
  if (guesstimateType && guesstimateType.sampler) {
    return guesstimateType.sampler.sample(input, n)
  } else {
    return {errors: ['No Valid Sampler']}
  }
}
