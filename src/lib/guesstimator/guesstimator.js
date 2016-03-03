import {format, errors, preFormatGuesstimate} from './formatter/index.js'
import {find} from './types.js'

import {parse} from './formatter/index.js'
import * as samplerTypes from './types.js'

//Guesstimator.parse({text: '3+123+FA'}]})

export class Guesstimator {
  static parse(unparsedInput) {
    const [parsedErrors, parsedInput] = parse(unparsedInput)
    const newItem = new this({unparsedInput, parsedErrors, parsedInput})
    return [parsedErrors, newItem]
  }

  static samplerTypes() {
    return samplerTypes.types
  }

  constructor({unparsedInput, parsedErrors, parsedInput}){
    this.unparsedInput = unparsedInput;
    this.parsedInput = parsedInput;
    this.parsedErrors = parsedErrors;
  }

  hasParsingErrors() {
    return !!this.parsedErrors.length
  }

  samplerType() {
    return samplerTypes.find(this.parsedInput.guesstimateType)
  }

  sample(n, externalInputs = []) {
    const samplerType = this.samplerType()
    return samplerType.sampler.sample(this.parsedInput, n)
  }
}
