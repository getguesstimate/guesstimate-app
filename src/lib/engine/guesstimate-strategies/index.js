import {Distribution} from './distributions/index.js'
import {Funct} from './functions/index.js'

//each strategy responds_to
//#isA, #isValid, #sample

export function getStrategy(g) {
  if (Funct.isA(g)) { return Funct }
  else if (Distribution.isA(g)) { return Distribution.simulator(g) }
  else { return 'unparseable' }
}
