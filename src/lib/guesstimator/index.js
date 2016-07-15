import {parse} from './formatter/index'
import {samplerTypes} from './types'

//Guesstimator.parse({text: '3+123+FA'}]})
export class Guesstimator {
  static parse(unparsedInput) {
    const [parsedError, parsedInput] = parse(unparsedInput)
    const newItem = new this({unparsedInput, parsedError, parsedInput})
    return [parsedError, newItem]
  }

  static samplerTypes = samplerTypes

  constructor({unparsedInput, parsedError, parsedInput}){
    this.unparsedInput = unparsedInput
    this.parsedError = parsedError || {}
    this.parsedInput = parsedInput
  }

  hasParsingErrors() {
    return !_.isEmpty(this.parsedError)
  }

  samplerType() {
    return samplerTypes.find(this.parsedInput.guesstimateType)
  }

  needsExternalInputs() {
    return (this.parsedInput.guesstimateType === 'FUNCTION')
  }

  sample(n, externalInputs = []) {
    if (!_.isEmpty(this.parsedError)){
      return Promise.resolve({errors: [this.parsedError], values: []})
    }

    const samplerType = this.samplerType()
    return samplerType.sampler.sample(this.parsedInput, n, externalInputs)
  }
}
