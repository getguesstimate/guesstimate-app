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
    this.parsedErrors = parsedErrors || [];
    this.parsedInput = parsedInput;
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
    return new Promise(
      (resolve, reject) => {
        if (!_.isEmpty(this.parsedErrors)){
          console.log(`Resolving in src/lib/guesstimator/index.js at line 36`)
          resolve({errors: this.parsedErrors, values: []})
        }

        const samplerType = this.samplerType()
        const sampleOrPromise = samplerType.sampler.sample(this.parsedInput, n, externalInputs)
        if (sampleOrPromise instanceof Promise) {
          sampleOrPromise.then( sample => {
            console.log(`Resolving in src/lib/guesstimator/index.js at line 43`)
            resolve(sample)
          } )
        } else {
          console.log(`Resolving in src/lib/guesstimator/index.js at line 46`)
          resolve(sampleOrPromise)
        }
      }
    )
  }
}
