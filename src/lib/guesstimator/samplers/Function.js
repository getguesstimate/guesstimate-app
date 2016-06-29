import {simulate} from './Simulator.js'

import {resolveProperty} from 'gModules/factBank/actions'

function resolveProperties(input) {
  if (!input) {return ""}
  const re = RegExp(/\@[\w]+\.[\w]+/g, "g")
  const res = input.replace(re, (match) => resolveProperty(match.slice(1).split('.')))
  return res
}

export var Sampler = {
  sample({text}, n, inputs) {
    return simulate(resolveProperties(text), inputs, n)
  }
}
