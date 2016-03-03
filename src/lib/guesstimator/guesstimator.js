import {parse} from './formatter/index.js'
import {samplerTypes} from './types.js'

//Guesstimator.parse({text: '3+123+FA'}]})
export class Guesstimator {
  static parse(unparsedInput) {
    const [parsedErrors, parsedInput] = parse(unparsedInput)
    const newItem = new this({unparsedInput, parsedErrors, parsedInput})
    return [parsedErrors, newItem]
  }

  static samplerTypes = samplerTypes

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

  needsExternalInputs() {
    return (this.parsedInput.guesstimateType === 'FUNCTION')
  }

  sample(n, externalInputs = []) {
    const samplerType = this.samplerType()
    const sample = samplerType.sampler.sample(this.parsedInput, n, externalInputs)
    return sample
  }
}