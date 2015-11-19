import {compile} from './compiler'
import {sample} from './sampler'
import {inputMetrics} from './lib'

class Simulator {
  constructor() {
    this.name = 'function'
  }

  isA(g) {
    return (g && g.input && (g.input[0] === '='))
  }

  sample(g, n, graph) {
    try {
      return this._sample(g,n,graph)
    } catch (exception) {
      return [{errors: [exception.message]}];
    }
  }

  inputMetrics(g, graph) {
    const results = inputMetrics(g.input, graph)
    return inputMetrics(g.input, graph)
  }

  _sample(g, n, graph) {
    const {inputs, compiled, errors} = compile(g.input, graph)
    if (errors) {
      return {errors: formatted.errors}
    } else {
      return sample(compiled, inputs, n)
    }
  }
}

export var Funct = new Simulator()
